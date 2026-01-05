import { Router, Request, Response } from 'express';
import { APIResponse } from '../../../shared/types';
import { StrategyModel, IStrategy } from '../../database/models/Strategy';

const router = Router();

// GET /api/strategies - Get all strategies
router.get('/', async (req: Request, res: Response<APIResponse<IStrategy[]>>) => {
  try {
    const strategies = await StrategyModel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: strategies,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch strategies',
      timestamp: new Date()
    });
  }
});

// GET /api/strategies/:id - Get strategy by ID
router.get('/:id', async (req: Request, res: Response<APIResponse<IStrategy>>) => {
  try {
    const strategy = await StrategyModel.findOne({ id: req.params.id });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found',
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      data: strategy,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch strategy',
      timestamp: new Date()
    });
  }
});

// POST /api/strategies - Create new strategy
router.post('/', async (req: Request, res: Response<APIResponse<IStrategy>>) => {
  try {
    const strategy = new StrategyModel(req.body);
    await strategy.save();

    res.status(201).json({
      success: true,
      data: strategy,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to create strategy',
      timestamp: new Date()
    });
  }
});

// PUT /api/strategies/:id - Update strategy
router.put('/:id', async (req: Request, res: Response<APIResponse<IStrategy>>) => {
  try {
    const strategy = await StrategyModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found',
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      data: strategy,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Failed to update strategy',
      timestamp: new Date()
    });
  }
});

// DELETE /api/strategies/:id - Delete strategy
router.delete('/:id', async (req: Request, res: Response<APIResponse<null>>) => {
  try {
    const strategy = await StrategyModel.findOneAndDelete({ id: req.params.id });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found',
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      data: null,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete strategy',
      timestamp: new Date()
    });
  }
});

export default router;
