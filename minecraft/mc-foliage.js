import { createBlock, blockMap } from './mc-world.js';

export function createTree(x, y, z) {
    for(let i=0; i<4; i++) createBlock(x, y+i, z, 'wood_oak');
    let top = y + 4;
    for(let lx=x-2; lx<=x+2; lx++){
        for(let lz=z-2; lz<=z+2; lz++){
            for(let ly=top-2; ly<=top+1; ly++){
                if (Math.abs(lx-x)+Math.abs(lz-z)+Math.abs(ly-top) <= 3) {
                     if (!blockMap.has(`${lx},${ly},${lz}`)) createBlock(lx, ly, lz, 'leaves_oak');
                }
            }
        }
    }
}
