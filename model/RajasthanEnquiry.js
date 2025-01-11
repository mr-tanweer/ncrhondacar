import mongoose from 'mongoose';

const RajasthanEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  model: { type: String, required: true },
  outlet: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Model caching to prevent redefinition errors
export default mongoose.models.RajasthanEnquiry || mongoose.model('RajasthanEnquiry', RajasthanEnquirySchema);
