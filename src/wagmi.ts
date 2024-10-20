import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  base,
  mainnet,
  optimism,
  sepolia,
  flowMainnet,
  flowTestnet
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    mainnet,
    optimism,
    base,
    sepolia,
    flowMainnet, 
    flowTestnet
  ],
  ssr: true,
});