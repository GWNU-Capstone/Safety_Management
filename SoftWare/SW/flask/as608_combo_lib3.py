import serial
import time
import os

try:
    import struct
except ImportError:
    import ustruct as struct

__version__ = "0.1"
__repo__ = ""

_DEFADDRESS = b'\xff\xff\xff\xff'
_STARTCODE = 0xEF01
_COMMANDPACKET = 0x1
_DATAPACKET = 0x2
_ACKPACKET = 0x7
_ENDDATAPACKET = 0x8

_GETIMAGE = 0x01
_IMAGE2TZ = 0x02
_COMPARE = 0x03
_FINGERPRINTSEARCH = 0x04
_REGMODEL = 0x05
_STORE = 0x06
_LOAD = 0x07
_UPLOAD = 0x08
_DOWNLOAD = 0x09
_UPLOADIMAGE = 0x0A
_DOWNLOADIMAGE = 0x0B
_DELETE = 0x0C
_EMPTY = 0x0D
_SETSYSPARA = 0x0E
_READSYSPARA = 0x0F
_HISPEEDSEARCH = 0x1B
_VERIFYPASSWORD = 0x13
_TEMPLATECOUNT = 0x1D
_TEMPLATEREAD = 0x1F
_SOFTRESET = 0x3D
_GETECHO = 0x53
_SETAURA = 0x35

# Packet error code
OK = 0x0
PACKETRECIEVEERR = 0x01
NOFINGER = 0x02
IMAGEFAIL = 0x03
IMAGEMESS = 0x06
FEATUREFAIL = 0x07
NOMATCH = 0x08
NOTFOUND = 0x09
ENROLLMISMATCH = 0x0A
BADLOCATION = 0x0B
DBRANGEFAIL = 0x0C
UPLOADFEATUREFAIL = 0x0D
PACKETRESPONSEFAIL = 0x0E
UPLOADFAIL = 0x0F
DELETEFAIL = 0x10
DBCLEARFAIL = 0x11
PASSFAIL = 0x13
INVALIDIMAGE = 0x15
FLASHERR = 0x18
INVALIDREG = 0x1A
ADDRCODE = 0x20
PASSVERIFY = 0x21
MODULEOK = 0x55


class Operation:
    """UART based fingerprint sensor."""

    _debug = False
    _uart = None

    password = None
    address = [0xFF, 0xFF, 0xFF, 0xFF]
    finger_id = None
    confidence = None
    templates = []
    template_count = None
    library_size = None
    security_level = None
    device_address = None
    data_packet_size = None
    baudrate = None
    system_id = None
    status_register = None

    def __init__(self, uart, passwd=(0, 0, 0, 0)):
        # Create object with UART for interface, and default 32-bit password
        self.password = passwd
        self._uart = uart
        if self.verify_password() != OK:
            raise RuntimeError("Failed to find sensor, check wiring!")
        if self.read_sysparam() != OK:
            raise RuntimeError("Failed to read system parameters!")

    def check_module(self):
        """Checks the state of the fingerprint scanner module.
        Returns OK or error."""
        self._send_packet([_GETECHO])
        if self._get_packet(12)[0] != MODULEOK:
            raise RuntimeError("Something is wrong with the sensor.")
        return True

    def verify_password(self):
        """Checks if the password/connection is correct, returns True/False"""
        self._send_packet([_VERIFYPASSWORD] + list(self.password))
        return self._get_packet(12)[0]

    def count_templates(self):
        """Requests the sensor to count the number of templates and stores it
        in ``self.template_count``. Returns the packet error code or OK success"""
        self._send_packet([_TEMPLATECOUNT])
        r = self._get_packet(14)
        self.template_count = struct.unpack(">H", bytes(r[1:3]))[0]
        return r[0]

    def read_sysparam(self):
        """Returns the system parameters on success via attributes."""
        self._send_packet([_READSYSPARA])
        r = self._get_packet(28)
        if r[0] != OK:
            raise RuntimeError("Command failed.")
        self.status_register = struct.unpack(">H", bytes(r[1:3]))[0]
        # print(bytes(r[1:3]) ,bytes(r[3:5]))
        self.system_id = struct.unpack(">H", bytes(r[3:5]))[0]
        self.library_size = struct.unpack(">H", bytes(r[5:7]))[0]
        self.security_level = struct.unpack(">H", bytes(r[7:9]))[0]
        self.device_address = bytes(r[9:13])
        self.data_packet_size = struct.unpack(">H", bytes(r[13:15]))[0]
        self.baudrate = struct.unpack(">H", bytes(r[15:17]))[0]
        return r[0]

    def set_sysparam(self, param_num, param_val):
        """Set the system parameters (param_num)"""
        self._send_packet([_SETSYSPARA, param_num, param_val])
        r = self._get_packet(12)
        if r[0] != OK:
            raise RuntimeError("Command failed.")
        if param_num == 4:
            self.baudrate = param_val
        elif param_num == 5:
            self.security_level = param_val
        elif param_num == 6:
            self.data_packet_size = param_val
        return r[0]

    def get_image(self):
        """Requests the sensor to take an image and store it memory, returns
        the packet error code or OK success"""
        self._send_packet([_GETIMAGE])
        return self._get_packet(12)[0]

    def image_2_tz(self, slot=1):
        """Requests the sensor convert the image to a template, returns
        the packet error code or OK success"""
        self._send_packet([_IMAGE2TZ, slot])
        return self._get_packet(12)[0]

    def create_model(self):
        """Requests the sensor take the template data and turn it into a model
        returns the packet error code or OK success"""
        self._send_packet([_REGMODEL])
        return self._get_packet(12)[0]

    def store_model(self, location, slot=1):
        """Requests the sensor store the model into flash memory and assign
        a location. Returns the packet error code or OK success"""
        self._send_packet([_STORE, slot, location >> 8, location & 0xFF])
        return self._get_packet(12)[0]

    def delete_model(self, location):
        """Requests the sensor delete a model from flash memory given by
        the argument location. Returns the packet error code or OK success"""
        self._send_packet([_DELETE, location >> 8, location & 0xFF, 0x00, 0x01])
        return self._get_packet(12)[0]

    def load_model(self, location, slot=1):
        """Requests the sensor to load a model from the given memory location
        to the given slot.  Returns the packet error code or success"""
        self._send_packet([_LOAD, slot, location >> 8, location & 0xFF])
        return self._get_packet(12)[0]

    def get_fpdata(self, sensorbuffer="char", slot=1):
        """Requests the sensor to transfer the fingerprint image or
        template.  Returns the data payload only."""
        if slot not in (1, 2):
            # raise error or use default value?
            slot = 2
        if sensorbuffer == "image":
            self._send_packet([_UPLOADIMAGE])
        elif sensorbuffer == "char":
            self._send_packet([_UPLOAD, slot])
        else:
            raise RuntimeError("Uknown sensor buffer type")
        if self._get_packet(12)[0] == 0:
            res = self._get_data(9)
            self._print_debug("get_fpdata data size:", str(len(res)))
        self._print_debug("get_fdata res:", res, data_type="hex")
        return res

    def send_fpdata(self, data, sensorbuffer="char", slot=1):
        """Requests the sensor to receive data, either a fingerprint image or
        a character/template data.  Data is the payload only."""
        if slot not in (1, 2):
            # raise error or use default value?
            slot = 2
        if sensorbuffer == "image":
            self._send_packet([_DOWNLOADIMAGE])
        elif sensorbuffer == "char":
            self._send_packet([_DOWNLOAD, slot])
        else:
            raise RuntimeError("Uknown sensor buffer type")
        if self._get_packet(12)[0] == 0:
            self._send_data(data)
            self._print_debug("send_fpdata data size:", str(len(data)))
        self._print_debug("sent_fdata data:", data, data_type="hex")
        return True

    def empty_library(self):
        """Requests the sensor to delete all models from flash memory.
        Returns the packet error code or OK success"""
        self._send_packet([_EMPTY])
        return self._get_packet(12)[0]

    def read_templates(self):
        """Requests the sensor to list of all template locations in use and
        stores them in self.templates. Returns the packet error code or
        OK success"""
        from math import ceil  # pylint: disable=import-outside-toplevel

        self.templates = []
        self.read_sysparam()
        temp_r = [
            0x0C,
        ]
        for j in range(ceil(self.library_size / 256)):
            self._send_packet([_TEMPLATEREAD, j])
            r = self._get_packet(44)
            if r[0] == OK:
                for i in range(32):
                    byte = r[i + 1]
                    for bit in range(8):
                        if byte & (1 << bit):
                            self.templates.append((i * 8) + bit + (j * 256))
                temp_r = r
            else:
                r = temp_r
        return r[0]

    def finger_fast_search(self):
        """Asks the sensor to search for a matching fingerprint template to the
        last model generated. Stores the location and confidence in self.finger_id
        and self.confidence. Returns the packet error code or OK success"""
        # high speed search of slot #1 starting at page 0x0000 and page #0x00A3
        # self._send_packet([_HISPEEDSEARCH, 0x01, 0x00, 0x00, 0x00, 0xA3])
        # or page #0x03E9 to accommodate modules with up to 1000 capacity
        # self._send_packet([_HISPEEDSEARCH, 0x01, 0x00, 0x00, 0x03, 0xE9])
        # or base the page on module's capacity
        self.read_sysparam()
        capacity = self.library_size
        self._send_packet(
            [_HISPEEDSEARCH, 0x01, 0x00, 0x00, capacity >> 8, capacity & 0xFF]
        )
        r = self._get_packet(16)
        self.finger_id, self.confidence = struct.unpack(">HH", bytes(r[1:5]))
        self._print_debug("finger_fast_search packet:", r, data_type="hex")
        return r[0]

    def close_uart(self):
        """close serial port"""
        self._uart.close()

    def finger_search(self):
        """Asks the sensor to search for a matching fingerprint starting at
        slot 1. Stores the location and confidence in self.finger_id
        and self.confidence. Returns the packet error code or OK success"""
        self.read_sysparam()
        capacity = self.library_size
        self._send_packet(
            [_FINGERPRINTSEARCH, 0x01, 0x00, 0x00, capacity >> 8, capacity & 0xFF]
        )
        r = self._get_packet(16)
        self.finger_id, self.confidence = struct.unpack(">HH", bytes(r[1:5]))
        self._print_debug("finger_search packet:", r, data_type="hex")
        return r[0]

    def compare_templates(self):
        """Compares two fingerprint templates in char buffers 1 and 2. Stores the confidence score
        in self.finger_id and self.confidence. Returns the packet error code or
        OK success"""
        self._send_packet([_COMPARE])
        r = self._get_packet(14)
        # self.confidence = struct.unpack(">H", bytes(r[1:4]))
        # self._print_debug("compare_templates confidence:", self.confidence)
        return r[0]

    def set_led(self, color=1, mode=3, speed=0x80, cycles=0):
        """LED function -- only for R503 Sensor.
        Parameters: See User Manual for full details
        color: 1=red, 2=blue, 3=purple
        mode: 1-breathe, 2-flash, 3-on, 4-off, 5-fade_on, 6-fade-off
        speed: animation speed 0-255
        cycles: numbe of time to repeat 0=infinite or 1-255
        Returns the packet error code or success"""
        self._send_packet([_SETAURA, mode, speed, color, cycles])
        return self._get_packet(12)[0]

    ##################################################
    
 
    def _get_packet(self, expected):
        #Helper to parse out a packet from the UART and check structure.
        #Returns just the data payload from the packet
        res = self._uart.read(expected)
        if res[0:4] == _DEFADDRESS:
            res = b'\xef\x01' + res
            expected = 30
        self._print_debug("_get_packet received data:", res, data_type="hex")
        if (not res) or (len(res) != expected):
            raise RuntimeError("Failed to read data from sensor2")

        # first two bytes are start code
        start = struct.unpack(">H", res[0:2])[0]

        if start != _STARTCODE:
            raise RuntimeError("Incorrect packet data")
        # next 4 bytes are address
        addr = list(i for i in res[2:6])
        if addr != self.address:
            raise RuntimeError("Incorrect address")

        packet_type, length = struct.unpack(">BH", res[6:9])
        if packet_type != _ACKPACKET:
            raise RuntimeError("Incorrect packet data")

        # we should check the checksum
        # but i don't know how
        # not yet anyway
        # packet_sum = struct.unpack('>H', res[9+(length-2):9+length])[0]
        # print(packet_sum)
        # print(packet_type + length + struct.unpack('>HHHH', res[9:9+(length-2)]))

        reply = list(i for i in res[9: 9 + (length - 2)])
        self._print_debug("_get_packet reply:", reply, data_type="hex")
        return reply

    def _get_data(self, expected):
        """Gets packet from serial and checks structure for _DATAPACKET
        and _ENDDATAPACKET.  Alternate method for getting data such
        as fingerprint image, etc.  Returns the data payload."""
        res = self._uart.read(expected)
        self._print_debug("_get_data received data:", res, data_type="hex")
        if (not res) or (len(res) != expected):
            raise RuntimeError("Failed to read data from sensor1")

        # first two bytes are start code
        start = struct.unpack(">H", res[0:2])[0]
        self._print_debug("_get_data received start pos:", start)
        if start != _STARTCODE:
            raise RuntimeError("Incorrect packet data")
        # next 4 bytes are address
        addr = list(i for i in res[2:6])
        self._print_debug("_get_data received address:", addr)
        if addr != self.address:
            raise RuntimeError("Incorrect address")

        packet_type, length = struct.unpack(">BH", res[6:9])
        self._print_debug("_get_data received packet_type:", packet_type)
        self._print_debug("_get_data received length:", length)

        # todo: check checksum

        if packet_type != _DATAPACKET:
            if packet_type != _ENDDATAPACKET:
                raise RuntimeError("Incorrect packet data")

        if packet_type == _DATAPACKET:
            res = self._uart.read(length - 2)
            # todo: we should really inspect the headers and checksum
            reply = list(i for i in res[0:length])
            received_checksum = struct.unpack(">H", self._uart.read(2))
            self._print_debug("_get_data received checksum:", received_checksum)

            reply += self._get_data(9)
        elif packet_type == _ENDDATAPACKET:
            res = self._uart.read(length - 2)
            # todo: we should really inspect the headers and checksum
            reply = list(i for i in res[0:length])
            received_checksum = struct.unpack(">H", self._uart.read(2))
            self._print_debug("_get_data received checksum:", received_checksum)

        self._print_debug("_get_data reply length:", len(reply))
        self._print_debug("_get_data reply:", reply, data_type="hex")
        return reply

    def _send_packet(self, data):
        packet = [_STARTCODE >> 8, _STARTCODE & 0xFF]
        packet = packet + self.address
        packet.append(_COMMANDPACKET)  # the packet type

        length = len(data) + 2
        packet.append(length >> 8)
        packet.append(length & 0xFF)

        packet = packet + data

        checksum = sum(packet[6:])
        packet.append(checksum >> 8)
        packet.append(checksum & 0xFF)

        self._print_debug("_send_packet length:", len(packet))
        self._print_debug("_send_packet data:", packet, data_type="hex")
        self._uart.write(bytearray(packet))

    def _send_data(self, data):
        self._print_debug("_send_data length:", len(data))
        self._print_debug("_send_data data:", data, data_type="hex")
        # self.read_sysparam() #moved this to init
        if self.data_packet_size == 0:
            data_length = 32
        elif self.data_packet_size == 1:
            data_length = 64
        elif self.data_packet_size == 2:
            data_length = 128
        elif self.data_packet_size == 3:
            data_length = 256
        self._print_debug("_send_data sensor data length:", data_length)
        i = 0
        left = len(data)
        for i in range(int(len(data) / data_length)):
            start = i * data_length
            end = (i + 1) * data_length
            left = left - data_length
            self._print_debug("_send_data data start:", start)
            self._print_debug("_send_data data end:", end)
            self._print_debug("_send_data i:", i)

            packet = [_STARTCODE >> 8, _STARTCODE & 0xFF]
            packet = packet + self.address

            if left <= 0:
                packet.append(_ENDDATAPACKET)
            else:
                packet.append(_DATAPACKET)

            length = len(data[start:end]) + 2
            self._print_debug("_send_data length:", length)
            packet.append(length >> 8)
            packet.append(length & 0xFF)
            checksum = _DATAPACKET + (length >> 8) + (length & 0xFF)

            # for j in range(len(data[start:end])):
            for j in range(start, end):
                packet.append(data[j])
                checksum += data[j]

            packet.append(checksum >> 8)
            packet.append(checksum & 0xFF)

            self._print_debug("_send_data sending packet:", packet, data_type="hex")
            self._uart.write(packet)

    def soft_reset(self):
        """Performs a soft reset of the sensor"""
        self._send_packet([_SOFTRESET])
        if self._get_packet(12)[0] == OK:
            if self._uart.read(1)[0] != MODULEOK:
                raise RuntimeError("Sensor did not send a handshake signal!")

    def _print_debug(self, info, data, data_type="str"):
        """Prints debugging information. This is activated
        by flag _debug"""
        if not self._debug:
            return

        if data_type == "hex":
            print("*** DEBUG ==>", info, ["{:02x}".format(i) for i in data])
        elif data_type == "str":
            print("*** DEBUG ==>", info, data)


##actual program start here
# establish serial connection and establish library session
"""
def connect_serial_session(comName):
    # check if the device connected to defined port
    try:
        # this is important to set baudrate of 115200 so there are no data lost
        ser = serial.Serial(comName, baudrate=57600, timeout=3)
    except Exception as e:
        return False
    else:
        # check if the correct fingerprint device connected
        try:
            session = Operation(ser)
        except Exception as e:
            return False
        return session  # this session will be use all over the operation
        
"""
def connect_serial_session(comName):
    max_retries = 5
    retry_delay = 2  # seconds

    for attempt in range(max_retries):
        try:
            # 시리얼 포트 연결 시도
            ser = serial.Serial(comName, baudrate=57600, timeout=3)
        except serial.SerialException as e:
            print(f"Serial connection failed on attempt {attempt + 1}/{max_retries}: {e}")
            time.sleep(retry_delay)
            continue  # 다음 시도
        else:
            try:
                # 올바른 지문 장치가 연결되었는지 확인
                session = Operation(ser)
                # 연결에 성공하면 세션 반환
                return session
            except Exception as e:
                print(f"Device initialization failed: {e}")
                ser.close()
                time.sleep(retry_delay)  # 잠시 대기 후 다시 시도
                continue  # 다음 시도

    print("Failed to connect to the serial device after several attempts.")
    return False

##basic infomation

def get_templates_list(session):
    '''a list of used templates number store in device'''
    session.read_templates()
    print("Fingerprint templates: ", session.templates)
    return session.templates  # list


def get_templates_count(session):
    '''number of print that stored in the device'''
    session.count_templates()
    print("Number of templates found: ", session.template_count)
    return session.template_count  # integer


def get_device_size(session):
    '''size of the device, how many print can be store'''
    session.read_sysparam()
    print("Size of template library: ", session.library_size)
    return session.library_size  # integer


# operation

# def find_next_location(session):
# 	return min(list(set(list(range(0, get_device_size(session) + 1))).difference(get_templates_list(session))))

def enroll_finger_to_device(session, as608_lib, location):
    """Take a 2 finger images and template it, then store in 'location'"""

    # get the location number that from low to high in order and no skiping
    if location is None:
        location = min(list(set(list(range(0, get_device_size(session) + 1))).difference(get_templates_list(session))))

    for fingerimg in range(1, 3):
        if fingerimg == 1:
            print("Place finger on sensor...", end="", flush=True)
        else:
            print("Place same finger again...", end="", flush=True)

        while True:
            i = session.get_image()
            if i == as608_lib.OK:
                print("Image taken")
                break
            if i == as608_lib.NOFINGER:
                print(".", end="", flush=True)
            elif i == as608_lib.IMAGEFAIL:
                print("Imaging error")
                return False
            else:
                print("Other error")
                return False

        print("Templating...", end="", flush=True)
        i = session.image_2_tz(fingerimg)
        if i == as608_lib.OK:
            print("Templated")
        else:
            if i == as608_lib.IMAGEMESS:
                print("Image too messy")
            elif i == as608_lib.FEATUREFAIL:
                print("Could not identify features")
            elif i == as608_lib.INVALIDIMAGE:
                print("Image invalid")
            else:
                print("Other error")
            return False

        if fingerimg == 1:
            print("Remove finger")
            time.sleep(1)
            while i != as608_lib.NOFINGER:
                i = session.get_image()

    print("Creating model...", end="", flush=True)
    i = session.create_model()
    if i == as608_lib.OK:
        print("Created")
    else:
        if i == as608_lib.ENROLLMISMATCH:
            print("Prints did not match")
        else:
            print("Other error")
        return False

    print("Storing model #%d..." % location, end="", flush=True)
    i = session.store_model(location)
    if i == as608_lib.OK:
        print("Stored")
        return("Stored model at #%d" % location)
    else:
        if i == as608_lib.BADLOCATION:
            print("Bad storage location")
        elif i == as608_lib.FLASHERR:
            print("Flash storage error")
        else:
            print("Other error")
        return False

    return True


def search_fingerprint_on_device(session, as608_lib):
    """Get a finger print image, template it, and see if it matches!"""
    print("Waiting for image...")
    start_time = time.time()
    while session.get_image() != as608_lib.OK:
        if time.time() - start_time > 20:
            return "No Response"
    print("Templating...")
    if session.image_2_tz(1) != as608_lib.OK:
        return("Not Found")
    print("Searching...")
    if session.finger_search() != as608_lib.OK:
        return("Not Found")
    return session.finger_id
    

def enroll_save_to_file(session, as608_lib, save_location, file_name):
    """Take a 2 finger images and template it, then store it in a file"""
    saved_directory_file_name = save_location + "/" + file_name + ".dat"
    for fingerimg in range(1, 3):
        if fingerimg == 1:
            print("Place finger on sensor...", end="", flush=True)
        else:
            print("Place same finger again...", end="", flush=True)

        while True:
            i = session.get_image()
            if i == as608_lib.OK:
                print("Image taken")
                break
            if i == as608_lib.NOFINGER:
                print(".", end="", flush=True)
            elif i == as608_lib.IMAGEFAIL:
                print("Imaging error")
                return False
            else:
                print("Other error")
                return False

        print("Templating...", end="", flush=True)
        i = session.image_2_tz(fingerimg)
        if i == as608_lib.OK:
            print("Templated")
        else:
            if i == as608_lib.IMAGEMESS:
                print("Image too messy")
            elif i == as608_lib.FEATUREFAIL:
                print("Could not identify features")
            elif i == as608_lib.INVALIDIMAGE:
                print("Image invalid")
            else:
                print("Other error")
            return False

        if fingerimg == 1:
            print("Remove finger")
            while i != as608_lib.NOFINGER:
                i = session.get_image()

    print("Creating model...", end="", flush=True)
    i = session.create_model()
    if i == as608_lib.OK:
        print("Created")
    else:
        if i == as608_lib.ENROLLMISMATCH:
            print("Prints did not match")
        else:
            print("Other error")
        return False

    print("Downloading template...")
    data = session.get_fpdata("char", 1)
    try:
        file = open(saved_directory_file_name, "wb")
    except FileNotFoundError as e:
        os.makedirs(save_location)
        file = open(saved_directory_file_name, "wb")
    file.write(bytearray(data))
    file.close()
    print("Template is saved in", saved_directory_file_name, "file.")

    return True


def fingerprint_check_one_file(session, as608_lib, save_location, file_name):
    """Compares a new fingerprint template to an existing template stored in a file
    This is useful when templates are stored centrally (i.e. in a database)"""
    search_directory_file_name = save_location + "/" + file_name + ".dat"
    print("Waiting for finger print...")
    while session.get_image() != as608_lib.OK:
        pass
    print("Templating...")
    if session.image_2_tz(1) != as608_lib.OK:
        return False

    print("Loading file template...", end="", flush=True)
    try:
        with open(search_directory_file_name, "rb") as file:
            data = file.read()
    except FileNotFoundError as e:
        print("Could not find file.")
    else:
        with open(search_directory_file_name, "rb") as file:
            data = file.read()
    session.send_fpdata(list(data), "char", 2)

    i = session.compare_templates()
    if i == as608_lib.OK:
        print("Fingerprint match template in file.")
        return True
    if i == as608_lib.NOMATCH:
        print("Templates do not match!")
    else:
        print("Other error!")
    return False


def fingerprint_check_all_file(session, as608_lib, save_location):
    """Compares a new fingerprint template to an existing template stored in a file
    This is useful when templates are stored centrally (i.e. in a database)"""
    file_check_res = False
    print("Waiting for finger print...")
    while session.get_image() != as608_lib.OK:
        pass
    print("Templating...")
    if session.image_2_tz(1) != as608_lib.OK:
        return False

    print("Loading file template...", end="", flush=True)

    if os.path.exists(save_location):
        # print(os.listdir(save_location))
        for each_file in os.listdir(save_location):
            # print("=-=-=-ENtering file-=-=-=-=--=",each_file)
            with open(save_location + "/" + each_file, "rb") as file:
                data = file.read()
            session.send_fpdata(list(data), "char", 2)

            i = session.compare_templates()
            if i == as608_lib.OK:
                print("Fingerprint match template in file.")
                return True
            if i == as608_lib.NOMATCH:
                print("Templates do not match!")
            # else:
            # 	print("Other error!")
            file_check_res = False
        return file_check_res
    else:
        print("NO")
        return False

def delete_all_templates(session):
    """Deletes all templates stored in the device"""
    session.empty_library()
    return("All templates deleted successfully.")

def delete_templates(session, location=None):
    location_input = location
    location = int(location_input) if location_input else None

    if location is None:
        return("location value is none")

    # Check if the location is within the valid range
    if 0 <= location <= 127:
        # Delete the template at the specified location
        result = session.delete_model(location)
        #if result == True:
        return(f"Template at location {location} deleted successfully.")
        #else:
        #    return(f"Failed to delete template at location {location}.")
    else:
        return("Invalid location. Please provide a location between 0 and 127.")

