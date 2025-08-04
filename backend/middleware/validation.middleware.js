import Joi from 'joi';

const ticketCreationSchema = Joi.object({
  issueType: Joi.string().valid('Bug', 'Feature Request', 'Technical Issue', 'Account Issue', 'Performance Issue', 'Security Issue', 'Other').required(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional(),
  team: Joi.string().valid('dev', 'qa', 'devops', 'support', 'product').optional(),
  description: Joi.string().min(10).max(2000).required(),
  submitterName: Joi.string().min(2).max(255).required(),
  submitterEmail: Joi.string().email().max(255).required(),
  assignedMember: Joi.string().max(255).optional()
});

const ticketUpdateSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  status: Joi.string().valid('Open', 'In Progress', 'Resolved', 'Closed').optional(),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional(),
  team: Joi.string().valid('dev', 'qa', 'devops', 'support', 'product').optional(),
  assignedMember: Joi.string().max(255).optional(),
  description: Joi.string().min(10).max(2000).optional()
}).min(1);

export const validateTicketCreation = (req, res, next) => {
  const { error, value } = ticketCreationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      message: error.details[0].message,
      field: error.details[0].path[0]
    });
  }

  req.body = value;
  next();
};

export const validateTicketUpdate = (req, res, next) => {
  const { error, value } = ticketUpdateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      message: error.details[0].message,
      field: error.details[0].path[0]
    });
  }

  req.body = value;
  next();
};
