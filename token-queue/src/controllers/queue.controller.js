import * as queueService from '../services/queue.service.js';

export const issueToken = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    const token = await queueService.issueToken(req.body, req.userId, authToken);
    res.status(201).json({
      success: true,
      message: 'Queue token issued successfully',
      data: token,
    });
  } catch (err) {
    next(err);
  }
};

export const getLiveQueue = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    const queue = await queueService.getLiveQueue({ doctorId, date });
    res.status(200).json({
      success: true,
      count: queue.length,
      data: queue,
    });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await queueService.changeTokenStatus(id, status);
    res.status(200).json({
      success: true,
      message: `Token status updated to ${status}`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const listTokens = async (req, res, next) => {
  try {
    const { page, limit, doctorId, status, date } = req.query;

    const result = await queueService.getTokens({
      page,
      limit,
      doctorId,
      status,
      date,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};
