const { Schema } = require('mongoose');

const PendingTasksSchema = new Schema(
  {
    refUnit: { type: Schema.Types.ObjectId, ref: 'refUnits', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'clients', required: true },
    taskDescription: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PendingTasksSchema.index({ refUnit: 1 });

module.exports = PendingTasksSchema;
