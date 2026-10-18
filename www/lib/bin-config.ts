// Bin sizes and pricing configuration
export interface BinConfig {
  size: string;
  label: string;
  volume: string;
  price: number;
}

export const BIN_SIZES: BinConfig[] = [
  {
    size: 'size_120_litres',
    label: '120 litres',
    volume: '120 litres',
    price: 30.00
  },
  {
    size: 'size_240_litres', 
    label: '240 litres',
    volume: '240 litres',
    price: 50.00
  },
  {
    size: 'size_10_cubic',
    label: '10 cubic',
    volume: '10 cubic',
    price: 600.00
  },
  {
    size: 'size_13_cubic',
    label: '3 cubic', 
    volume: '3 cubic',
    price: 800.00
  },
  {
    size: 'size_23_cubic',
    label: '23 cubic',
    volume: '23 cubic', 
    price: 1200.00
  }
];

// Get bin configuration by size
export const getBinConfig = (size: string): BinConfig => {
  return BIN_SIZES.find(bin => bin.size === size) || BIN_SIZES[1]; // Default to medium
};

// Get bin price by size
export const getBinPrice = (size: string): number => {
  return getBinConfig(size).price;
};

// Get bin label by size
export const getBinLabel = (size: string): string => {
  return getBinConfig(size).label;
};


