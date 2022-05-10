const locale = "en-US";

const registerViews = [
    ["reg_ah", 0, 1],
    ["reg_al", 1, 1],
    ["reg_bh", 2, 1],
    ["reg_bl", 3, 1],
    ["reg_ch", 4, 1],
    ["reg_cl", 5, 1],
    ["reg_dh", 6, 1],
    ["reg_dl", 7, 1],
    ["reg_flg", 8, 1],
    ["reg_ax", 0, 2],
    ["reg_bx", 2, 2],
    ["reg_cx", 4, 2],
    ["reg_dx", 6, 2],
    ["reg_pc", 9, 2],
    ["reg_sp", 11, 2],
    ["reg_fp", 13, 2],
    // ["reg_code_id", 15, 1],
    // ["reg_ram_id", 16, 1],
    // ["reg_atlas1_id", 17, 1],
    // ["reg_atlas2_id", 18, 1],
    // ["reg_save_id", 19, 1],
];

const flagViews = [
    ["flg_carry", 7],
    ["flg_zero", 6],
    ["flg_signed", 5],
    ["flg_overflow", 4],
    ["flg_less", 3],
    ["flg_greater", 2],
    ["flg_interrupts", 0],
];

function updateRegisters(registers) {
    for (let data of registerViews) {
        if (data[2] === 1) {
            const value = registers[data[1]];
            window.document.getElementById(data[0]+"_dec").innerText = byte(value);
            window.document.getElementById(data[0]+"_hex").innerText = byteToHex(value);
            window.document.getElementById(data[0]+"_bin").innerText = byteToBin(value);
        } else {
            let value = registers[data[1]];
            value <<= 8;
            value += registers[data[1] + 1];
            window.document.getElementById(data[0]+"_dec").innerText = word(value);
            window.document.getElementById(data[0]+"_hex").innerText = wordToHex(value);
            window.document.getElementById(data[0]+"_bin").innerText = wordToBin(value);
        }
    }
    for (let data of flagViews) {
        let value = getBit(registers[8], data[1]);
        window.document.getElementById(data[0]).checked = value;
    }
}

function getBit(number, bitPosition) {
    return ((number>>bitPosition) % 2 !== 0);
}

function padSpaces(str, targetLen) {
    while (str.length < targetLen) {
        str = " " + str;
    }
    return str;
}

function padZeros(str, targetLen) {
    while (str.length < targetLen) {
        str = "0" + str;
    }
    return str;
}

function byteToHex(num) {
    const hex = num.toString(16).toLocaleUpperCase(locale);
    return padZeros(hex, 2);
}

function wordToHex(num) {
    const hex = num.toString(16).toLocaleUpperCase(locale);
    return padZeros(hex, 4);
}

function byteToBin(num) {
    const hex = num.toString(2).toLocaleUpperCase(locale);
    return padZeros(hex, 8);
}

function wordToBin(num) {
    const hex = num.toString(2).toLocaleUpperCase(locale);
    return padZeros(hex, 16);
}

function byte(num) {
    return padZeros(num,3);
}

function word(num) {
    return padZeros(num,5);
}

function autoExpand(field) {

    // Reset field height
    field.style.height = 'inherit';

    // Get the computed styles for the element
    var computed = window.getComputedStyle(field);

    // Calculate the height
    var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
        + parseInt(computed.getPropertyValue('padding-top'), 10)
        + field.scrollHeight
        + parseInt(computed.getPropertyValue('padding-bottom'), 10)
        + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    field.style.height = height + 'px';

}

function calcRegDiff(oldRegisters, newRegisters) {
    let changed = "";
    for (let data of registerViews) {
        let name = data[0].split("_")[1].toLocaleUpperCase("en-US");
        let values = [];
        if (data[2] === 1) {
            const oldVal = oldRegisters[data[1]];
            const newVal = newRegisters[data[1]];
            values = [oldVal, newVal];
        } else {
            let oldVal = oldRegisters[data[1]];
            oldVal <<= 8;
            oldVal += oldRegisters[data[1] + 1];
            let newVal = newRegisters[data[1]];
            newVal <<= 8;
            newVal += newRegisters[data[1] + 1];
            values = [oldVal, newVal];
        }
        if (values[0] !== values[1]) {
            if (changed.length > 0) {
                changed += ", ";
            }
            changed += `${name} ${values[0]} -> ${values[1]}`;
        }
    }
    return changed;
}