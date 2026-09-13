/**
 * QR Code Generator
 * Pure TypeScript implementation of QR code generation
 * Based on the original jquery-qrcode algorithm
 */

const MODE_NUMBER = 1;
const MODE_ALPHA_NUM = 2;
const MODE_8BIT_BYTE = 4;
const MODE_KANJI = 8;

interface QRDataItem {
  mode: number;
  data: string;
}

interface RSBlock {
  totalCount: number;
  dataCount: number;
}

class QRPolynomial {
  num: number[];
  offset: number;

  constructor(num: number[], offset: number) {
    this.num = num;
    this.offset = offset;
  }

  get(index: number): number {
    return this.num[index + this.offset];
  }

  getLength(): number {
    return this.num.length - this.offset;
  }

  multiply(e: QRPolynomial): QRPolynomial {
    const num = new Array(this.getLength() + e.getLength() - 1);
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= QRMath.multiply(this.get(i), e.get(j));
      }
    }
    return new QRPolynomial(num, 0);
  }

  mod(e: QRPolynomial): QRPolynomial {
    if (this.getLength() - e.getLength() < 0) {
      return this;
    }
    const quot = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
    const num = new Array(this.getLength());
    for (let i = 0; i < this.getLength(); i++) {
      num[i] = this.num[i + this.offset];
    }
    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= QRMath.multiply(e.get(i), QRMath.gexp(quot + i));
    }
    return new QRPolynomial(num, 0).mod(e);
  }
}

class QRRSBlock {
  static RS_BLOCK_TABLE = [
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    [1, 70, 55],
    [1, 70, 44],
    [2, 70, 34],
    [2, 70, 26],
    [1, 100, 80],
    [2, 100, 60],
    [2, 100, 46],
    [4, 100, 22],
    [1, 134, 108],
    [2, 134, 78],
    [2, 134, 59],
    [2, 134, 36],
    [2, 154, 122],
    [4, 154, 90],
    [2, 154, 72],
    [4, 154, 39],
    [2, 180, 146],
    [3, 180, 111],
    [4, 180, 80],
    [1, 180, 58],
    [2, 204, 163],
    [4, 204, 122],
    [4, 204, 90],
    [4, 204, 50],
    [2, 228, 182],
    [4, 228, 140],
    [4, 228, 103],
    [3, 228, 60],
    [3, 252, 201],
    [3, 252, 155],
    [3, 252, 116],
    [9, 252, 37],
    [3, 288, 223],
    [3, 288, 175],
    [4, 288, 131],
    [11, 288, 45],
  ];

  totalCount: number;
  dataCount: number;

  constructor(totalCount: number, dataCount: number) {
    this.totalCount = totalCount;
    this.dataCount = dataCount;
  }

  static getRSBlocks(typeNumber: number, errorCorrectLevel: number): QRRSBlock[] {
    const rsBlockTable = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
    if (!rsBlockTable) {
      throw new Error(`bad rs block @ typeNumber:${typeNumber}/errorCorrectLevel:${errorCorrectLevel}`);
    }
    const length = rsBlockTable.length / 3;
    const rsBlocks: QRRSBlock[] = [];
    for (let i = 0; i < length; i++) {
      const count = rsBlockTable[i * 3 + 0];
      const totalCount = rsBlockTable[i * 3 + 1];
      const dataCount = rsBlockTable[i * 3 + 2];
      for (let j = 0; j < count; j++) {
        rsBlocks.push(new QRRSBlock(totalCount, dataCount));
      }
    }
    return rsBlocks;
  }

  static getRsBlockTable(
    typeNumber: number,
    errorCorrectLevel: number
  ): number[] | undefined {
    switch (errorCorrectLevel) {
      case 0:
        return QRRSBlock.RS_BLOCK_TABLE[typeNumber * 4 + 0];
      case 1:
        return QRRSBlock.RS_BLOCK_TABLE[typeNumber * 4 + 1];
      case 2:
        return QRRSBlock.RS_BLOCK_TABLE[typeNumber * 4 + 2];
      case 3:
        return QRRSBlock.RS_BLOCK_TABLE[typeNumber * 4 + 3];
      default:
        return undefined;
    }
  }
}

class QRBitBuffer {
  buffer: number[] = [];
  length = 0;

  getLengthInBits(): number {
    return this.length;
  }

  put(num: number, length: number) {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1);
    }
  }

  putBit(bit: boolean) {
    const bufIndex = Math.floor(this.length / 8);
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0);
    }
    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> this.length % 8;
    }
    this.length++;
  }
}

class QRMath {
  static EXP_TABLE = new Array(256);
  static LOG_TABLE = new Array(256);

  static initialize() {
    for (let i = 0; i < 8; i++) {
      QRMath.EXP_TABLE[i] = 1 << i;
    }
    for (let i = 8; i < 256; i++) {
      QRMath.EXP_TABLE[i] =
        QRMath.EXP_TABLE[i - 4] ^
        QRMath.EXP_TABLE[i - 5] ^
        QRMath.EXP_TABLE[i - 6] ^
        QRMath.EXP_TABLE[i - 8];
    }
    for (let i = 0; i < 255; i++) {
      QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
    }
  }

  static glog(n: number): number {
    if (n < 1) throw new Error(`glog(${n})`);
    return QRMath.LOG_TABLE[n];
  }

  static gexp(n: number): number {
    while (n < 0) {
      n += 255;
    }
    while (n >= 256) {
      n -= 255;
    }
    return QRMath.EXP_TABLE[n];
  }

  static multiply(x: number, y: number): number {
    if (x === 0 || y === 0) return 0;
    return QRMath.EXP_TABLE[(QRMath.LOG_TABLE[x] + QRMath.LOG_TABLE[y]) % 255];
  }
}

QRMath.initialize();

export class QRCode {
  typeNumber: number;
  errorCorrectLevel: number;
  modules: (boolean | null)[][] | null = null;
  moduleCount: number = 0;
  dataCache: number[] | null = null;
  dataList: QRDataItem[] = [];

  constructor(typeNumber: number, errorCorrectLevel: number) {
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
  }

  addData(data: string) {
    this.dataList.push({ mode: MODE_8BIT_BYTE, data });
    this.dataCache = null;
  }

  isDark(row: number, col: number): boolean {
    if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
      throw new Error(`out of range: row=${row}, col=${col}`);
    }
    return this.modules![row][col] === true;
  }

  getModuleCount(): number {
    return this.moduleCount;
  }

  make() {
    this.makeImpl(false, this.getBestMaskPattern());
  }

  makeImpl(test: boolean, maskPattern: number) {
    this.moduleCount = this.typeNumber * 4 + 17;
    this.modules = [];
    for (let row = 0; row < this.moduleCount; row++) {
      this.modules[row] = [];
      for (let col = 0; col < this.moduleCount; col++) {
        this.modules[row][col] = null;
      }
    }
    this.setupPositionProbePattern(0, 0);
    this.setupPositionProbePattern(this.moduleCount - 7, 0);
    this.setupPositionProbePattern(0, this.moduleCount - 7);
    this.setupPositionAdjustPattern();
    this.setupTimingPattern();
    this.setupTypeInfo(test, maskPattern);
    if (this.typeNumber >= 7) {
      this.setupTypeNumber(test);
    }
    if (!test) {
      this.dataCache = this.createData(
        this.errorCorrectLevel,
        this.dataList
      );
    }
    this.mapData(this.dataCache!, maskPattern);
  }

  setupPositionProbePattern(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      if (row + r < 0 || this.moduleCount <= row + r) continue;
      for (let c = -1; c <= 7; c++) {
        if (col + c < 0 || this.moduleCount <= col + c) continue;
        if (
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          this.modules![row + r][col + c] = true;
        } else {
          this.modules![row + r][col + c] = false;
        }
      }
    }
  }

  setupPositionAdjustPattern() {
    const pos = QRCodeUtil.getPatternPosition(this.typeNumber);
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i];
        const col = pos[j];
        if (this.modules![row][col] === null) {
          for (let r = -2; r <= 2; r++) {
            for (let c = -2; c <= 2; c++) {
              this.modules![row + r][col + c] =
                r === 0 || c === 0 || (r === -2 || r === 2) && (c === -2 || c === 2)
                  ? true
                  : false;
            }
          }
        }
      }
    }
  }

  setupTimingPattern() {
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules![r][6] === null) {
        this.modules![r][6] = r % 2 === 0;
      }
    }
    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules![6][c] === null) {
        this.modules![6][c] = c % 2 === 0;
      }
    }
  }

  setupTypeInfo(test: boolean, maskPattern: number) {
    const data = (this.errorCorrectLevel << 3) | maskPattern;
    const bits = QRCodeUtil.getBCHTypeInfo(data);
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      if (i < 6) {
        this.modules![i][8] = mod;
      } else if (i < 8) {
        this.modules![i + 1][8] = mod;
      } else if (i < 9) {
        this.modules![this.moduleCount - 15 + i][8] = mod;
      } else {
        this.modules![this.moduleCount - 15 + i + 1][8] = mod;
      }
    }
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      if (i < 8) {
        this.modules![8][this.moduleCount - i - 1] = mod;
      } else if (i < 9) {
        this.modules![8][15 - i - 1 + 1] = mod;
      } else {
        this.modules![8][15 - i - 1] = mod;
      }
    }
    this.modules![this.moduleCount - 8][8] = !test;
  }

  setupTypeNumber(test: boolean) {
    const bits = QRCodeUtil.getBCHTypeNumber(this.typeNumber);
    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      this.modules![Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
    }
    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1;
      this.modules![i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
    }
  }

  mapData(data: number[], maskPattern: number) {
    let inc = -1;
    let row = this.moduleCount - 1;
    let bitIndex = 7;
    let byteIndex = 0;
    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules![row][col - c] === null) {
            let dark = false;
            if (byteIndex < data.length) {
              dark = ((data[byteIndex] >>> bitIndex) & 1) === 1;
            }
            if (QRCodeUtil.getMaskFunction(maskPattern)(row, col - c)) {
              dark = !dark;
            }
            this.modules![row][col - c] = dark;
            bitIndex--;
            if (bitIndex === -1) {
              byteIndex++;
              bitIndex = 7;
            }
          }
        }
        row += inc;
        if (row < 0 || this.moduleCount <= row) {
          row -= inc;
          inc = -inc;
          break;
        }
      }
    }
  }

  createData(errorCorrectLevel: number, dataList: QRDataItem[]): number[] {
    const rsBlocks = QRRSBlock.getRSBlocks(this.typeNumber, errorCorrectLevel);
    const buffer = new QRBitBuffer();
    for (let i = 0; i < dataList.length; i++) {
      const data = dataList[i];
      buffer.put(data.mode, 4);
      buffer.put(data.data.length, QRCodeUtil.getLengthInBits(data.mode, this.typeNumber));
      for (let j = 0; j < data.data.length; j++) {
        buffer.put(data.data.charCodeAt(j), 8);
      }
    }
    let totalDataCount = 0;
    for (let i = 0; i < rsBlocks.length; i++) {
      totalDataCount += rsBlocks[i].dataCount;
    }
    if (buffer.getLengthInBits() > 8 * totalDataCount) {
      throw new Error(
        `code length overflow. (${buffer.getLengthInBits()}>` +
        `${8 * totalDataCount})`
      );
    }
    let totalCodeCount = 0;
    for (let i = 0; i < rsBlocks.length; i++) {
      totalCodeCount += rsBlocks[i].totalCount;
    }
    const data: number[] = [];
    let index = 0;
    for (let i = 0; i < rsBlocks.length; i++) {
      const dataCount = rsBlocks[i].dataCount;
      for (let j = 0; j < dataCount; j++) {
        data[index++] = buffer.buffer[j];
      }
    }
    return data;
  }

  getBestMaskPattern(): number {
    let minLostPoint = 0;
    let bestMaskPattern = 0;
    for (let maskPattern = 0; maskPattern < 8; maskPattern++) {
      this.makeImpl(true, maskPattern);
      const lostPoint = QRCodeUtil.getLostPoint(this);
      if (maskPattern === 0 || lostPoint < minLostPoint) {
        minLostPoint = lostPoint;
        bestMaskPattern = maskPattern;
      }
    }
    return bestMaskPattern;
  }
}

class QRCodeUtil {
  static PATTERN_POSITION_TABLE = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170],
  ];

  static G15 =
    (1 << 10) |
    (1 << 8) |
    (1 << 5) |
    (1 << 4) |
    (1 << 2) |
    (1 << 1) |
    (1 << 0);
  static G18 =
    (1 << 12) |
    (1 << 11) |
    (1 << 10) |
    (1 << 9) |
    (1 << 8) |
    (1 << 5) |
    (1 << 2) |
    (1 << 0);
  static G15_MASK = (1 << 15) - 1;

  static getBCHTypeInfo(data: number): number {
    let d = data << 10;
    while (QRCodeUtil.getBCHDigit(d) - QRCodeUtil.getBCHDigit(QRCodeUtil.G15) >= 0) {
      d ^= QRCodeUtil.G15 << (QRCodeUtil.getBCHDigit(d) - QRCodeUtil.getBCHDigit(QRCodeUtil.G15));
    }
    return ((data << 10) | d) ^ QRCodeUtil.G15_MASK;
  }

  static getBCHTypeNumber(data: number): number {
    let d = data << 12;
    while (QRCodeUtil.getBCHDigit(d) - QRCodeUtil.getBCHDigit(QRCodeUtil.G18) >= 0) {
      d ^= QRCodeUtil.G18 << (QRCodeUtil.getBCHDigit(d) - QRCodeUtil.getBCHDigit(QRCodeUtil.G18));
    }
    return (data << 12) | d;
  }

  static getBCHDigit(data: number): number {
    let digit = 0;
    while (data !== 0) {
      digit++;
      data >>>= 1;
    }
    return digit;
  }

  static getPatternPosition(typeNumber: number): number[] {
    return QRCodeUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
  }

  static getMaskFunction(maskPattern: number): (row: number, col: number) => boolean {
    switch (maskPattern) {
      case 0:
        return (row: number, col: number) => (row + col) % 2 === 0;
      case 1:
        return (row: number) => row % 2 === 0;
      case 2:
        return (col: number) => col % 3 === 0;
      case 3:
        return (row: number, col: number) => (row + col) % 3 === 0;
      case 4:
        return (row: number, col: number) =>
          (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
      case 5:
        return (row: number, col: number) => (row * col) % 2 + (row * col) % 3 === 0;
      case 6:
        return (row: number, col: number) =>
          ((row * col) % 2 + (row * col) % 3) % 2 === 0;
      case 7:
        return (row: number, col: number) =>
          ((row + col) % 2 + (row * col) % 3) % 2 === 0;
      default:
        throw new Error(`bad maskPattern: ${maskPattern}`);
    }
  }

  static getLengthInBits(mode: number, type: number): number {
    if (1 <= type && type < 10) {
      switch (mode) {
        case MODE_NUMBER:
          return 10;
        case MODE_ALPHA_NUM:
          return 9;
        case MODE_8BIT_BYTE:
          return 8;
        case MODE_KANJI:
          return 8;
        default:
          throw new Error(`mode: ${mode}`);
      }
    } else if (type < 27) {
      switch (mode) {
        case MODE_NUMBER:
          return 12;
        case MODE_ALPHA_NUM:
          return 11;
        case MODE_8BIT_BYTE:
          return 16;
        case MODE_KANJI:
          return 10;
        default:
          throw new Error(`mode: ${mode}`);
      }
    } else if (type < 41) {
      switch (mode) {
        case MODE_NUMBER:
          return 14;
        case MODE_ALPHA_NUM:
          return 13;
        case MODE_8BIT_BYTE:
          return 16;
        case MODE_KANJI:
          return 12;
        default:
          throw new Error(`mode: ${mode}`);
      }
    } else {
      throw new Error(`type: ${type}`);
    }
  }

  static getLostPoint(qrcode: QRCode): number {
    const moduleCount = qrcode.getModuleCount();
    let lostPoint = 0;

    // Adjacent modules in row having same color
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        let sameCount = 0;
        const dark = qrcode.isDark(row, col);
        for (let r = -1; r <= 1; r++) {
          if (row + r < 0 || moduleCount <= row + r) continue;
          for (let c = -1; c <= 1; c++) {
            if (col + c < 0 || moduleCount <= col + c) continue;
            if (r === 0 && c === 0) continue;
            if (dark === qrcode.isDark(row + r, col + c)) {
              sameCount++;
            }
          }
        }
        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5;
        }
      }
    }

    // Block of modules having same color
    for (let row = 0; row < moduleCount - 1; row++) {
      for (let col = 0; col < moduleCount - 1; col++) {
        let count = 0;
        if (qrcode.isDark(row, col)) count++;
        if (qrcode.isDark(row + 1, col)) count++;
        if (qrcode.isDark(row, col + 1)) count++;
        if (qrcode.isDark(row + 1, col + 1)) count++;
        if (count === 0 || count === 4) {
          lostPoint += 3;
        }
      }
    }

    // 1:1:3:1:1 ratio (dark:light:dark:light:dark) in row/column
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount - 6; col++) {
        if (
          qrcode.isDark(row, col) &&
          !qrcode.isDark(row, col + 1) &&
          qrcode.isDark(row, col + 2) &&
          qrcode.isDark(row, col + 3) &&
          qrcode.isDark(row, col + 4) &&
          !qrcode.isDark(row, col + 5) &&
          qrcode.isDark(row, col + 6)
        ) {
          lostPoint += 40;
        }
      }
    }

    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount - 6; row++) {
        if (
          qrcode.isDark(row, col) &&
          !qrcode.isDark(row + 1, col) &&
          qrcode.isDark(row + 2, col) &&
          qrcode.isDark(row + 3, col) &&
          qrcode.isDark(row + 4, col) &&
          !qrcode.isDark(row + 5, col) &&
          qrcode.isDark(row + 6, col)
        ) {
          lostPoint += 40;
        }
      }
    }

    // Proportion of dark modules in entire symbol
    let darkCount = 0;
    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount; row++) {
        if (qrcode.isDark(row, col)) {
          darkCount++;
        }
      }
    }

    const ratio = Math.abs((100 * darkCount) / moduleCount / moduleCount - 50) / 5;
    lostPoint += ratio * 10;

    return lostPoint;
  }
}
