import QueueToken from '../models/QueueToken.model.js';

export const countTokensForDateAndDoctor = async (queueDate, doctorId) => {
  return await QueueToken.countDocuments({ queueDate, doctorId });
};

export const createToken = async (tokenData) => {
  const token = new QueueToken(tokenData);
  return await token.save();
};

export const findTokenById = async (tokenId) => {
  return await QueueToken.findById(tokenId).lean();
};

export const updateTokenStatus = async (tokenId, updateFields) => {
  return await QueueToken.findByIdAndUpdate(
    tokenId,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).lean();
};

export const getLiveQueue = async ({ queueDate, doctorId, statusList }) => {
  const query = { queueDate };
  if (doctorId) query.doctorId = doctorId;
  if (statusList && statusList.length > 0) {
    query.status = { $in: statusList };
  }

  return await QueueToken.find(query)
    .sort({ priorityRank: 1, tokenNumber: 1 })
    .lean();
};

export const getAllTokensPaginated = async ({ query, limit = 20, skip = 0 }) => {
  const [tokens, total] = await Promise.all([
    QueueToken.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    QueueToken.countDocuments(query),
  ]);

  return { tokens, total };
};
