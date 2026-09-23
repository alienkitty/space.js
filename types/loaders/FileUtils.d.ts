import type { Asset } from './AssetLoader.js';

export interface AssetData {
    asset: Asset;
    filename: string;
}

/**
 * A set of file utility functions.
 *
 * @see {@link https://github.com/alienkitty/space.js/blob/main/src/loaders/FileUtils.js | Source}
 */

export function loadFile(file: File): Promise<Asset>;

export function loadFiles(files: File[]): Promise<AssetData[]>;
