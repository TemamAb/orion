import mongoose, { Schema, Document } from 'mongoose';

export interface IStrategy extends Document {
  id: string;
  name: string;
  type: 'ARBITRAGE' | 'FLASH_LOAN' | 'MEV' | 'LIQUIDITY';
  parameters: Record<string, any>;
  isActive: boolean;
  performance: {
    totalTrades: number;
    successfulTrades: number;
    totalProfit: string;
    winRate: number;
    averageExecutionTime: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const StrategySchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['ARBITRAGE', 'FLASH_LOAN', 'MEV', 'LIQUIDITY'],
    required: true
  },
  parameters: { type: Schema.Types.Mixed, default: {} },
  isActive: { type: Boolean, default: true },
  performance: {
    totalTrades: { type: Number, default: 0 },
    successfulTrades: { type: Number, default: 0 },
    totalProfit: { type: String, default: '0' },
    winRate: { type: Number, default: 0 },
    averageExecutionTime: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for performance
StrategySchema.index({ type: 1, isActive: 1 });
StrategySchema.index({ 'performance.winRate': -1 });

export const StrategyModel = mongoose.model<IStrategy>('Strategy', StrategySchema);
