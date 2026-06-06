import React, { useState, useEffect, useRef } from 'react';
import { getDocuments, uploadDocument, deleteDocument } from '../../api/documentApi';
import { FileText, FileSpreadsheet, Image, File, UploadCloud, Trash2, Download, Loader2, FileWarning } from 'lucide-react';

const formatSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (format) => {
  const f = format?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(f) || f.startsWith('image/')) {
    return <Image size={24} color="#38bdf8" />;
  }
  if (f === 'pdf' || f.includes('pdf')) {
    return <FileText size={24} color="#f43f5e" />;
  }
  if (['xls', 'xlsx', 'csv'].includes(f) || f.includes('sheet') || f.includes('csv')) {
    return <FileSpreadsheet size={24} color="#10b981" />;
  }
  return <File size={24} color="#9ca3af" />;
};

const Documents = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await getDocuments();
      setDocs(res.data || []);
    } catch (err) {
      setError('Failed to fetch documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    // Valid formats: jpg, png, pdf, docx
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx'];
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(extension)) {
      setError('Unsupported file type. Please upload JPG, PNG, PDF, or DOCX.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name.replace(/\.[^/.]+$/, "")); // remove extension for user-friendly name

    try {
      const res = await uploadDocument(formData);
      setSuccess('Document uploaded successfully!');
      setDocs((prev) => [res.data, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await deleteDocument(id);
      setSuccess('Document deleted successfully.');
      setDocs((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError('Failed to delete document.');
    }
  };

  return (
    <div style={styles.container} className="animate-slide">
      <div>
        <h1 style={styles.title} className="text-gradient">Documents Manager</h1>
        <p style={styles.sub}>Upload and manage your photo identity, CVs, certificates, and other documents.</p>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}
      {success && <div style={styles.successAlert}>{success}</div>}

      {/* Upload Zone */}
      <div 
        style={{
          ...styles.uploadZone,
          borderColor: dragActive ? '#6366f1' : 'rgba(255,255,255,0.08)',
          backgroundColor: dragActive ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.01)',
        }}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf,.docx"
          disabled={uploading}
        />
        {uploading ? (
          <div style={styles.uploadInner}>
            <Loader2 size={36} color="#6366f1" className="animate-spin" />
            <span style={styles.uploadText}>Uploading to Cloudinary...</span>
          </div>
        ) : (
          <div style={styles.uploadInner}>
            <UploadCloud size={36} color="#6b7280" />
            <span style={styles.uploadText}>
              Drag & Drop your file here, or <span style={styles.browseText}>browse</span>
            </span>
            <span style={styles.uploadHint}>Supports PDF, JPG, PNG, and DOCX (Max 10MB)</span>
          </div>
        )}
      </div>

      {/* Documents Grid */}
      <div style={styles.gridSection}>
        <h2 style={styles.gridTitle}>Uploaded Documents ({docs.length})</h2>
        {loading ? (
          <div style={styles.loadingContainer}>
            <Loader2 size={24} color="#6366f1" className="animate-spin" />
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>Loading your files...</span>
          </div>
        ) : docs.length === 0 ? (
          <div className="glass-card" style={styles.emptyCard}>
            <FileWarning size={32} color="#6b7280" />
            <p style={{ color: '#9ca3af', margin: '8px 0 0' }}>No documents uploaded yet.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {docs.map((doc) => (
              <div key={doc._id} className="glass-card" style={styles.docCard}>
                <div style={styles.docIconHeader}>
                  {getFileIcon(doc.format)}
                  <span style={styles.docFormatBadge}>{doc.format?.toUpperCase()}</span>
                </div>
                
                <div style={styles.docMeta}>
                  <h3 style={styles.docName} title={doc.name}>{doc.name}</h3>
                  <div style={styles.docDetailsRow}>
                    <span>{formatSize(doc.size)}</span>
                    <span>·</span>
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={styles.cardActions}>
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-secondary" 
                    style={styles.actionBtn}
                  >
                    <Download size={14} />
                    View/Download
                  </a>
                  <button 
                    onClick={() => handleDelete(doc._id)} 
                    className="btn" 
                    style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  title: { fontSize: '24px', fontWeight: '800', color: '#f3f4f6' },
  sub: { fontSize: '13px', color: '#6b7280', marginTop: '4px' },
  errorAlert: { backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '12px', borderRadius: '6px', fontSize: '13px' },
  successAlert: { backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '12px', borderRadius: '6px', fontSize: '13px' },
  uploadZone: {
    border: '2px dashed rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  uploadInner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  uploadText: { fontSize: '14px', color: '#9ca3af', fontWeight: '500' },
  browseText: { color: '#6366f1', textDecoration: 'underline', fontWeight: '600' },
  uploadHint: { fontSize: '11px', color: '#6b7280' },
  gridSection: { display: 'flex', flexDirection: 'column', gap: '16px' },
  gridTitle: { fontSize: '16px', fontWeight: '700', color: '#f3f4f6' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
  docCard: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' },
  docIconHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  docFormatBadge: { fontSize: '10px', fontWeight: '700', color: '#9ca3af', backgroundColor: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px' },
  docMeta: { display: 'flex', flexDirection: 'column', gap: '4px' },
  docName: { fontSize: '14px', fontWeight: '700', color: '#f3f4f6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  docDetailsRow: { display: 'flex', gap: '6px', fontSize: '11px', color: '#6b7280', fontWeight: '500' },
  cardActions: { display: 'flex', gap: '8px', marginTop: 'auto' },
  actionBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', padding: '8px 10px' },
  deleteBtn: { backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444' },
  emptyCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', textAlign: 'center' },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '40px 0' },
};

export default Documents;
