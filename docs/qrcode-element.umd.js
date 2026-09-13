"use strict";
var QRCodeElement = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/qrcode-element.ts
  var qrcode_element_exports = {};
  __export(qrcode_element_exports, {
    QRCodeElement: () => QRCodeElement
  });

  // src/qrcode.ts
  var MODE_NUMBER = 1;
  var MODE_ALPHA_NUM = 2;
  var MODE_8BIT_BYTE = 4;
  var MODE_KANJI = 8;
  var QRPolynomial = class _QRPolynomial {
    constructor(num, offset) {
      __publicField(this, "num");
      __publicField(this, "offset");
      let firstNonZero = 0;
      while (firstNonZero < num.length && num[firstNonZero] === 0) {
        firstNonZero++;
      }
      this.num = new Array(num.length - firstNonZero + offset).fill(0);
      for (let i = 0; i < num.length - firstNonZero; i++) {
        this.num[i] = num[i + firstNonZero];
      }
      this.offset = 0;
    }
    get(index) {
      return this.num[index + this.offset];
    }
    getLength() {
      return this.num.length - this.offset;
    }
    multiply(e) {
      const num = new Array(this.getLength() + e.getLength() - 1);
      for (let i = 0; i < this.getLength(); i++) {
        for (let j = 0; j < e.getLength(); j++) {
          num[i + j] ^= QRMath.multiply(this.get(i), e.get(j));
        }
      }
      return new _QRPolynomial(num, 0);
    }
    mod(e) {
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
      return new _QRPolynomial(num, 0).mod(e);
    }
  };
  var _QRRSBlock = class _QRRSBlock {
    constructor(totalCount, dataCount) {
      __publicField(this, "totalCount");
      __publicField(this, "dataCount");
      this.totalCount = totalCount;
      this.dataCount = dataCount;
    }
    static getRSBlocks(typeNumber, errorCorrectLevel) {
      const rsBlockTable = _QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
      if (!rsBlockTable) {
        throw new Error(
          `bad rs block @ typeNumber:${typeNumber}/errorCorrectLevel:${errorCorrectLevel}`
        );
      }
      const length = rsBlockTable.length / 3;
      const rsBlocks = [];
      for (let i = 0; i < length; i++) {
        const count = rsBlockTable[i * 3 + 0];
        const totalCount = rsBlockTable[i * 3 + 1];
        const dataCount = rsBlockTable[i * 3 + 2];
        for (let j = 0; j < count; j++) {
          rsBlocks.push(new _QRRSBlock(totalCount, dataCount));
        }
      }
      return rsBlocks;
    }
    static getRsBlockTable(typeNumber, errorCorrectLevel) {
      switch (errorCorrectLevel) {
        case 0:
          return _QRRSBlock.RS_BLOCK_TABLE[typeNumber * 4 + 0];
        case 1:
          return _QRRSBlock.RS_BLOCK_TABLE[typeNumber * 4 + 1];
        case 2:
          return _QRRSBlock.RS_BLOCK_TABLE[typeNumber * 4 + 2];
        case 3:
          return _QRRSBlock.RS_BLOCK_TABLE[typeNumber * 4 + 3];
        default:
          return void 0;
      }
    }
  };
  __publicField(_QRRSBlock, "RS_BLOCK_TABLE", [
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
    [11, 288, 45]
  ]);
  var QRRSBlock = _QRRSBlock;
  var QRBitBuffer = class {
    constructor() {
      __publicField(this, "buffer", []);
      __publicField(this, "length", 0);
    }
    getLengthInBits() {
      return this.length;
    }
    put(num, length) {
      for (let i = 0; i < length; i++) {
        this.putBit((num >>> length - i - 1 & 1) === 1);
      }
    }
    putBit(bit) {
      const bufIndex = Math.floor(this.length / 8);
      if (this.buffer.length <= bufIndex) {
        this.buffer.push(0);
      }
      if (bit) {
        this.buffer[bufIndex] |= 128 >>> this.length % 8;
      }
      this.length++;
    }
  };
  var _QRMath = class _QRMath {
    static initialize() {
      for (let i = 0; i < 8; i++) {
        _QRMath.EXP_TABLE[i] = 1 << i;
      }
      for (let i = 8; i < 256; i++) {
        _QRMath.EXP_TABLE[i] = _QRMath.EXP_TABLE[i - 4] ^ _QRMath.EXP_TABLE[i - 5] ^ _QRMath.EXP_TABLE[i - 6] ^ _QRMath.EXP_TABLE[i - 8];
      }
      for (let i = 0; i < 255; i++) {
        _QRMath.LOG_TABLE[_QRMath.EXP_TABLE[i]] = i;
      }
    }
    static glog(n) {
      if (n < 1) throw new Error(`glog(${n})`);
      return _QRMath.LOG_TABLE[n];
    }
    static gexp(n) {
      while (n < 0) {
        n += 255;
      }
      while (n >= 256) {
        n -= 255;
      }
      return _QRMath.EXP_TABLE[n];
    }
    static multiply(x, y) {
      if (x === 0 || y === 0) return 0;
      return _QRMath.EXP_TABLE[(_QRMath.LOG_TABLE[x] + _QRMath.LOG_TABLE[y]) % 255];
    }
  };
  __publicField(_QRMath, "EXP_TABLE", new Array(256));
  __publicField(_QRMath, "LOG_TABLE", new Array(256));
  var QRMath = _QRMath;
  QRMath.initialize();
  var QRCode = class {
    constructor(typeNumber, errorCorrectLevel) {
      __publicField(this, "typeNumber");
      __publicField(this, "errorCorrectLevel");
      __publicField(this, "modules", null);
      __publicField(this, "moduleCount", 0);
      __publicField(this, "dataCache", null);
      __publicField(this, "dataList", []);
      this.typeNumber = typeNumber;
      this.errorCorrectLevel = errorCorrectLevel;
    }
    addData(data) {
      this.dataList.push({ mode: MODE_8BIT_BYTE, data });
      this.dataCache = null;
    }
    isDark(row, col) {
      if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
        throw new Error(`out of range: row=${row}, col=${col}`);
      }
      return this.modules[row][col] === true;
    }
    getModuleCount() {
      return this.moduleCount;
    }
    make() {
      if (this.typeNumber < 1) {
        this.typeNumber = this.getSmallestTypeNumber();
      }
      this.dataCache = this.createData(this.errorCorrectLevel, this.dataList);
      this.makeImpl(false, this.getBestMaskPattern());
    }
    getSmallestTypeNumber() {
      for (let typeNumber = 1; typeNumber <= QRRSBlock.RS_BLOCK_TABLE.length / 4; typeNumber++) {
        const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);
        const totalDataCount = rsBlocks.reduce((total, block) => total + block.dataCount, 0);
        const dataLength = this.dataList.reduce(
          (length, data) => length + 4 + QRCodeUtil.getLengthInBits(data.mode, typeNumber) + data.data.length * 8,
          0
        );
        if (dataLength <= totalDataCount * 8) {
          return typeNumber;
        }
      }
      throw new Error("code length overflow");
    }
    makeImpl(test, maskPattern) {
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
        this.dataCache = this.createData(this.errorCorrectLevel, this.dataList);
      }
      this.mapData(this.dataCache ?? [], maskPattern);
    }
    setupPositionProbePattern(row, col) {
      for (let r = -1; r <= 7; r++) {
        if (row + r < 0 || this.moduleCount <= row + r) continue;
        for (let c = -1; c <= 7; c++) {
          if (col + c < 0 || this.moduleCount <= col + c) continue;
          if (0 <= r && r <= 6 && (c === 0 || c === 6) || 0 <= c && c <= 6 && (r === 0 || r === 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
            this.modules[row + r][col + c] = true;
          } else {
            this.modules[row + r][col + c] = false;
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
          if (this.modules[row][col] === null) {
            for (let r = -2; r <= 2; r++) {
              for (let c = -2; c <= 2; c++) {
                this.modules[row + r][col + c] = r === 0 || c === 0 || (r === -2 || r === 2) && (c === -2 || c === 2) ? true : false;
              }
            }
          }
        }
      }
    }
    setupTimingPattern() {
      for (let r = 8; r < this.moduleCount - 8; r++) {
        if (this.modules[r][6] === null) {
          this.modules[r][6] = r % 2 === 0;
        }
      }
      for (let c = 8; c < this.moduleCount - 8; c++) {
        if (this.modules[6][c] === null) {
          this.modules[6][c] = c % 2 === 0;
        }
      }
    }
    setupTypeInfo(test, maskPattern) {
      const data = this.errorCorrectLevel << 3 | maskPattern;
      const bits = QRCodeUtil.getBCHTypeInfo(data);
      for (let i = 0; i < 15; i++) {
        const mod = !test && (bits >> i & 1) === 1;
        if (i < 6) {
          this.modules[i][8] = mod;
        } else if (i < 8) {
          this.modules[i + 1][8] = mod;
        } else {
          this.modules[this.moduleCount - 15 + i][8] = mod;
        }
      }
      for (let i = 0; i < 15; i++) {
        const mod = !test && (bits >> i & 1) === 1;
        if (i < 8) {
          this.modules[8][this.moduleCount - i - 1] = mod;
        } else if (i < 9) {
          this.modules[8][15 - i - 1 + 1] = mod;
        } else {
          this.modules[8][15 - i - 1] = mod;
        }
      }
      this.modules[this.moduleCount - 8][8] = !test;
    }
    setupTypeNumber(test) {
      const bits = QRCodeUtil.getBCHTypeNumber(this.typeNumber);
      for (let i = 0; i < 18; i++) {
        const mod = !test && (bits >> i & 1) === 1;
        this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
      }
      for (let i = 0; i < 18; i++) {
        const mod = !test && (bits >> i & 1) === 1;
        this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    }
    mapData(data, maskPattern) {
      let inc = -1;
      let row = this.moduleCount - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = this.moduleCount - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (this.modules[row][col - c] === null) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              if (QRCodeUtil.getMaskFunction(maskPattern)(row, col - c)) {
                dark = !dark;
              }
              this.modules[row][col - c] = dark;
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
    createData(errorCorrectLevel, dataList) {
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
          `code length overflow. (${buffer.getLengthInBits()}>${8 * totalDataCount})`
        );
      }
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(false);
      }
      while (buffer.getLengthInBits() < totalDataCount * 8) {
        buffer.put(236, 8);
        if (buffer.getLengthInBits() < totalDataCount * 8) {
          buffer.put(17, 8);
        }
      }
      return this.createBytes(buffer, rsBlocks);
    }
    createBytes(buffer, rsBlocks) {
      const dataCodes = [];
      const errorCorrectionCodes = [];
      let offset = 0;
      let maxDataCount = 0;
      let maxErrorCorrectionCount = 0;
      for (let i = 0; i < rsBlocks.length; i++) {
        const dataCount = rsBlocks[i].dataCount;
        const errorCorrectionCount = rsBlocks[i].totalCount - dataCount;
        const dataCode = buffer.buffer.slice(offset, offset + dataCount);
        offset += dataCount;
        const errorCorrectionPolynomial = QRCodeUtil.getErrorCorrectPolynomial(errorCorrectionCount);
        const remainder = new QRPolynomial(dataCode, errorCorrectionPolynomial.getLength() - 1).mod(
          errorCorrectionPolynomial
        );
        const errorCorrectionCode = new Array(errorCorrectionCount).fill(0);
        for (let j = 0; j < errorCorrectionCount; j++) {
          const remainderIndex = j + remainder.getLength() - errorCorrectionCount;
          if (remainderIndex >= 0) errorCorrectionCode[j] = remainder.get(remainderIndex);
        }
        dataCodes.push(dataCode);
        errorCorrectionCodes.push(errorCorrectionCode);
        maxDataCount = Math.max(maxDataCount, dataCount);
        maxErrorCorrectionCount = Math.max(maxErrorCorrectionCount, errorCorrectionCount);
      }
      const data = [];
      for (let i = 0; i < maxDataCount; i++) {
        for (const dataCode of dataCodes) if (i < dataCode.length) data.push(dataCode[i]);
      }
      for (let i = 0; i < maxErrorCorrectionCount; i++) {
        for (const errorCorrectionCode of errorCorrectionCodes) {
          if (i < errorCorrectionCode.length) data.push(errorCorrectionCode[i]);
        }
      }
      return data;
    }
    getBestMaskPattern() {
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
  };
  var _QRCodeUtil = class _QRCodeUtil {
    static getBCHTypeInfo(data) {
      let d = data << 10;
      while (_QRCodeUtil.getBCHDigit(d) - _QRCodeUtil.getBCHDigit(_QRCodeUtil.G15) >= 0) {
        d ^= _QRCodeUtil.G15 << _QRCodeUtil.getBCHDigit(d) - _QRCodeUtil.getBCHDigit(_QRCodeUtil.G15);
      }
      return (data << 10 | d) ^ _QRCodeUtil.G15_MASK;
    }
    static getBCHTypeNumber(data) {
      let d = data << 12;
      while (_QRCodeUtil.getBCHDigit(d) - _QRCodeUtil.getBCHDigit(_QRCodeUtil.G18) >= 0) {
        d ^= _QRCodeUtil.G18 << _QRCodeUtil.getBCHDigit(d) - _QRCodeUtil.getBCHDigit(_QRCodeUtil.G18);
      }
      return data << 12 | d;
    }
    static getBCHDigit(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    }
    static getPatternPosition(typeNumber) {
      return _QRCodeUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
    }
    static getMaskFunction(maskPattern) {
      switch (maskPattern) {
        case 0:
          return (row, col) => (row + col) % 2 === 0;
        case 1:
          return (row) => row % 2 === 0;
        case 2:
          return (col) => col % 3 === 0;
        case 3:
          return (row, col) => (row + col) % 3 === 0;
        case 4:
          return (row, col) => (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
        case 5:
          return (row, col) => row * col % 2 + row * col % 3 === 0;
        case 6:
          return (row, col) => (row * col % 2 + row * col % 3) % 2 === 0;
        case 7:
          return (row, col) => ((row + col) % 2 + row * col % 3) % 2 === 0;
        default:
          throw new Error(`bad maskPattern: ${maskPattern}`);
      }
    }
    static getErrorCorrectPolynomial(errorCorrectLength) {
      let polynomial = new QRPolynomial([1], 0);
      for (let i = 0; i < errorCorrectLength; i++) {
        polynomial = polynomial.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
      }
      return polynomial;
    }
    static getLengthInBits(mode, type) {
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
    static getLostPoint(qrcode) {
      const moduleCount = qrcode.getModuleCount();
      let lostPoint = 0;
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
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount - 6; col++) {
          if (qrcode.isDark(row, col) && !qrcode.isDark(row, col + 1) && qrcode.isDark(row, col + 2) && qrcode.isDark(row, col + 3) && qrcode.isDark(row, col + 4) && !qrcode.isDark(row, col + 5) && qrcode.isDark(row, col + 6)) {
            lostPoint += 40;
          }
        }
      }
      for (let col = 0; col < moduleCount; col++) {
        for (let row = 0; row < moduleCount - 6; row++) {
          if (qrcode.isDark(row, col) && !qrcode.isDark(row + 1, col) && qrcode.isDark(row + 2, col) && qrcode.isDark(row + 3, col) && qrcode.isDark(row + 4, col) && !qrcode.isDark(row + 5, col) && qrcode.isDark(row + 6, col)) {
            lostPoint += 40;
          }
        }
      }
      let darkCount = 0;
      for (let col = 0; col < moduleCount; col++) {
        for (let row = 0; row < moduleCount; row++) {
          if (qrcode.isDark(row, col)) {
            darkCount++;
          }
        }
      }
      const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;
      return lostPoint;
    }
  };
  __publicField(_QRCodeUtil, "PATTERN_POSITION_TABLE", [
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
    [6, 30, 58, 86, 114, 142, 170]
  ]);
  __publicField(_QRCodeUtil, "G15", 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0);
  __publicField(_QRCodeUtil, "G18", 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0);
  __publicField(_QRCodeUtil, "G15_MASK", (1 << 15) - 1);
  var QRCodeUtil = _QRCodeUtil;

  // src/render.ts
  function renderQRCode(options) {
    const qrcode = new QRCode(options.typeNumber, options.errorCorrectLevel);
    qrcode.addData(options.text);
    qrcode.make();
    if (options.render === "canvas") {
      return renderCanvas(qrcode, options);
    } else {
      return renderSVG(qrcode, options);
    }
  }
  function renderCanvas(qrcode, options) {
    const canvas = document.createElement("canvas");
    canvas.width = options.width;
    canvas.height = options.height;
    const ctx = canvas.getContext("2d");
    const moduleCount = qrcode.getModuleCount();
    const cellWidth = options.width / moduleCount;
    const cellHeight = options.height / moduleCount;
    ctx.fillStyle = options.background;
    ctx.fillRect(0, 0, options.width, options.height);
    ctx.fillStyle = options.foreground;
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qrcode.isDark(row, col)) {
          const x = Math.floor(col * cellWidth);
          const y = Math.floor(row * cellHeight);
          const w = Math.ceil((col + 1) * cellWidth) - x;
          const h = Math.ceil((row + 1) * cellHeight) - y;
          ctx.fillRect(x, y, w, h);
        }
      }
    }
    return canvas;
  }
  function renderSVG(qrcode, options) {
    const moduleCount = qrcode.getModuleCount();
    const cellWidth = options.width / moduleCount;
    const cellHeight = options.height / moduleCount;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", String(options.width));
    svg.setAttribute("height", String(options.height));
    svg.setAttribute("viewBox", `0 0 ${options.width} ${options.height}`);
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("width", String(options.width));
    bg.setAttribute("height", String(options.height));
    bg.setAttribute("fill", options.background);
    svg.appendChild(bg);
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qrcode.isDark(row, col)) {
          const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          const x = Math.floor(col * cellWidth);
          const y = Math.floor(row * cellHeight);
          const w = Math.ceil((col + 1) * cellWidth) - x;
          const h = Math.ceil((row + 1) * cellHeight) - y;
          rect.setAttribute("x", String(x));
          rect.setAttribute("y", String(y));
          rect.setAttribute("width", String(w));
          rect.setAttribute("height", String(h));
          rect.setAttribute("fill", options.foreground);
          svg.appendChild(rect);
        }
      }
    }
    return svg;
  }

  // src/qrcode-element.ts
  var QRCodeElement = class _QRCodeElement extends HTMLElement {
    constructor() {
      super();
      __publicField(this, "resizeObserver", null);
      this.attachShadow({ mode: "open" });
    }
    static register(tag = "qr-code") {
      if (!customElements.get(tag)) {
        customElements.define(tag, _QRCodeElement);
      }
    }
    connectedCallback() {
      this.render();
      this.setupResizeObserver();
    }
    disconnectedCallback() {
      this.cleanupResizeObserver();
    }
    attributeChangedCallback(_name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this.render();
      }
    }
    static get observedAttributes() {
      return [
        "data-text",
        "data-width",
        "data-height",
        "data-render",
        "data-foreground",
        "data-background",
        "data-error-level"
      ];
    }
    get text() {
      return this.getAttribute("data-text") || "";
    }
    set text(value) {
      this.setAttribute("data-text", value);
    }
    get width() {
      return parseInt(this.getAttribute("data-width") || "256", 10);
    }
    set width(value) {
      this.setAttribute("data-width", String(value));
    }
    get height() {
      return parseInt(this.getAttribute("data-height") || "256", 10);
    }
    set height(value) {
      this.setAttribute("data-height", String(value));
    }
    get renderType() {
      return this.getAttribute("data-render") || "canvas";
    }
    set renderType(value) {
      this.setAttribute("data-render", value);
    }
    get foreground() {
      return this.getAttribute("data-foreground") || "#000000";
    }
    set foreground(value) {
      this.setAttribute("data-foreground", value);
    }
    get background() {
      return this.getAttribute("data-background") || "#ffffff";
    }
    set background(value) {
      this.setAttribute("data-background", value);
    }
    get errorLevel() {
      return parseInt(this.getAttribute("data-error-level") || "0", 10);
    }
    set errorLevel(value) {
      this.setAttribute("data-error-level", String(Math.max(0, Math.min(3, value))));
    }
    render() {
      const shadow = this.shadowRoot;
      if (!shadow) return;
      const text = this.text;
      if (!text) {
        shadow.innerHTML = "<style>:host { display: block; } div { color: red; }  </style><div>No text provided</div>";
        return;
      }
      try {
        const qrcodeElement = renderQRCode({
          text,
          width: this.width,
          height: this.height,
          typeNumber: 0,
          errorCorrectLevel: this.errorLevel,
          foreground: this.foreground,
          background: this.background,
          render: this.renderType
        });
        const style = document.createElement("style");
        style.textContent = `
        :host {
          display: inline-block;
        }
        div {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `;
        const container = document.createElement("div");
        container.appendChild(qrcodeElement);
        shadow.innerHTML = "";
        shadow.appendChild(style);
        shadow.appendChild(container);
        this.dispatchEvent(
          new CustomEvent("qrcode-ready", {
            detail: { text, width: this.width, height: this.height },
            bubbles: true,
            composed: true
          })
        );
      } catch (error) {
        const style = document.createElement("style");
        style.textContent = ":host { display: block; } div { color: red; }";
        const div = document.createElement("div");
        div.textContent = `Error: ${error instanceof Error ? error.message : String(error)}`;
        shadow.innerHTML = "";
        shadow.appendChild(style);
        shadow.appendChild(div);
      }
    }
    setupResizeObserver() {
      if (typeof ResizeObserver === "undefined") return;
      this.resizeObserver = new ResizeObserver(() => {
        this.render();
      });
      this.resizeObserver.observe(this);
    }
    cleanupResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
    }
  };
  if (typeof window !== "undefined" && !customElements.get("qr-code")) {
    customElements.define("qr-code", QRCodeElement);
  }
  return __toCommonJS(qrcode_element_exports);
})();
//# sourceMappingURL=qrcode-element.umd.js.map
