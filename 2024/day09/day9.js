import { swap } from "../../common/arrays";
import ArrayReader from "../../common/array_reader";

export default function run(input) {
    let originalMemory = input.split('').map(p => parseInt(p)).flatMap((p, i) => i % 2 == 0 ? Array(p).fill(i / 2) : Array(p).fill(-1));
    let part1Memory = defragmentPart1(originalMemory);
    let part2Memory = defragmentPart2(originalMemory);

    return {
        part1: checksum(part1Memory),
        part2: checksum(part2Memory)
    }
}

function defragmentPart1(memory) {
    let memCopy = [...memory];
    memCopy.forEach((element, i) => {
        while (element == -1 && (memCopy[i] = memCopy.pop()) == -1);
    });
    return memCopy;
}

function defragmentPart2(memory) {
    let memCopy = [...memory];
    let reverse = new ArrayReader([...memCopy].reverse());
    while (!reverse.end()) {
        while (reverse.peek() == -1) {
            reverse.readNext();
        }
        let requiredSpace = reverse.read(reverse.peek());
        let readIndex = memCopy.length - reverse.readIndex;
        for (let i = 0; i < readIndex; i++) {
            if (memCopy[i] != -1) continue;

            let writeIndex = i;
            while (memCopy[++i] == -1) { }
            if (i - writeIndex < requiredSpace) continue;
            for (let x = 0; x < requiredSpace; x++) {
                swap(memCopy, writeIndex++, readIndex + x);
            }
            break;
        };
    };
    return memCopy;
}

function checksum(memory) {
    return memory.reduce((sum, val, i) => sum + (val != -1 ? (i * val) : 0), 0);
}