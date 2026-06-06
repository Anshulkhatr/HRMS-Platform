const path = require('path');
const fs = require('fs');
const Document = require('../models/document.model');
const cloudinary = require('../../config/cloudinary');
const config = require('../../config/env');
const auditService = require('../../audit/services/audit.service');

class DocumentController {
  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a file' });
      }

      // If uploaded via cloudinary, multer-storage-cloudinary attaches `path` or `secure_url` to req.file
      const fileUrl = req.file.path || req.file.secure_url || `/uploads/${req.file.filename}`;

      // Create document in database
      const document = await Document.create({
        userId: req.user.id,
        tenantId: req.tenantId,
        name: req.body.name || req.file.originalname,
        url: fileUrl,
        filename: req.file.filename || req.file.originalname,
        size: req.file.size,
        format: req.file.mimetype || path.extname(req.file.originalname).substring(1),
      });

      await auditService.log(req.user.id, req.tenantId, 'DOCUMENT_UPLOAD', req.ip || '', `Uploaded document: ${document.name}`);

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocuments(req, res, next) {
    try {
      const targetUserId = req.query.userId || req.user.id;

      // Access control: Non-admins/non-managers can only fetch their own documents
      if (targetUserId !== req.user.id && !['SuperAdmin', 'TenantAdmin', 'Manager'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      const query = {
        userId: targetUserId,
        tenantId: req.tenantId,
      };

      const documents = await Document.find(query).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req, res, next) {
    try {
      const document = await Document.findById(req.params.id);

      if (!document) {
        return res.status(404).json({ success: false, message: 'Document not found' });
      }

      // Check tenant matching
      if (String(document.tenantId) !== String(req.tenantId)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      // Check owner matching
      if (String(document.userId) !== String(req.user.id) && !['SuperAdmin', 'TenantAdmin', 'Manager'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      // Delete from Cloudinary if hosted there
      if (config.cloudinary.cloudName && config.cloudinary.apiKey && document.url.includes('cloudinary')) {
        try {
          await cloudinary.uploader.destroy(document.filename);
        } catch (cloudinaryErr) {
          // Log and continue, database record deletion is primary
          console.error('Failed to delete from Cloudinary:', cloudinaryErr);
        }
      } else if (document.url.startsWith('/uploads/')) {
        // Delete local fallback file
        const filePath = path.join(__dirname, '../../../uploads', document.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await Document.findByIdAndDelete(req.params.id);

      await auditService.log(req.user.id, req.tenantId, 'DOCUMENT_DELETE', req.ip || '', `Deleted document: ${document.name}`);

      res.status(200).json({
        success: true,
        message: 'Document deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DocumentController();
