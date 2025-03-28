var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import path from 'path';
const minifyFile = (parentDir, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path.join(parentDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        fs.writeFileSync(filePath, JSON.stringify(JSON.parse(content)));
        console.log(`Minified ${filePath}`);
    }
    catch (error) {
        console.error(`Error minifying ${file}:`, error);
    }
});
const minify = () => {
    const paths = [
        path.resolve(process.cwd(), 'lib/assets'),
        path.resolve(process.cwd(), 'lib/cjs/assets')
    ];
    paths.forEach(parentDir => {
        fs.readdirSync(parentDir).forEach((file) => {
            if (file.endsWith('.json')) {
                minifyFile(parentDir, file);
            }
        });
    });
};
minify();
