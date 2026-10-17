import { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, CheckCircle2 } from 'lucide-react';
import { prescriptionsAPI } from '../../services/api';
import { Prescription } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useToast } from '../../components/ui/Toaster';

export default function CustomerPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const { showToast } = useToast();

  // New prescription form state
  const [doctorName, setDoctorName] = useState('');
  const [pd, setPd] = useState('63');
  const [sphR, setSphR] = useState('0.00');
  const [sphL, setSphL] = useState('0.00');
  const [cylR, setCylR] = useState('0.00');
  const [cylL, setCylL] = useState('0.00');
  const [axisR, setAxisR] = useState('0');
  const [axisL, setAxisL] = useState('0');
  const [notes, setNotes] = useState('');

  const loadPrescriptions = () => {
    setLoading(true);
    prescriptionsAPI.getAll()
      .then((res) => setPrescriptions(res.data.data || []))
      .catch(() => setPrescriptions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPrescriptions(); }, []);

  const handleSavePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await prescriptionsAPI.create({
        doctorName,
        pupillaryDistance: parseFloat(pd) || 63,
        rightEye: { sphere: parseFloat(sphR) || 0, cylinder: parseFloat(cylR) || 0, axis: parseInt(axisR) || 0 },
        leftEye: { sphere: parseFloat(sphL) || 0, cylinder: parseFloat(cylL) || 0, axis: parseInt(axisL) || 0 },
        notes,
      });
      showToast('Prescription saved to your account!', 'success');
      setFormOpen(false);
      loadPrescriptions();
    } catch {
      showToast('Failed to save prescription.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await prescriptionsAPI.delete(id);
      showToast('Prescription removed.', 'info');
      loadPrescriptions();
    } catch {
      showToast('Failed to delete prescription.', 'error');
    }
  };

  const inp = {
    padding: '0.45rem', borderRadius: 4, border: '1px solid #D8CFC4',
    fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', textAlign: 'center' as const,
  };

  if (loading) return <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}><LoadingSpinner size="md" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.85rem', color: '#30251F', margin: 0 }}>
          Prescription Records
        </h1>
        <button
          onClick={() => setFormOpen(!formOpen)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#B65E43', color: 'white', border: 'none', borderRadius: 6, padding: '0.65rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={16} /> Add Prescription
        </button>
      </div>

      {formOpen && (
        <div style={{ background: 'white', borderRadius: 14, padding: '2rem', border: '1px solid #F0EAE0', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(48,37,31,0.06)' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#30251F', margin: '0 0 1.25rem' }}>
            Enter New Prescription
          </h3>
          <form onSubmit={handleSavePrescription}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>Doctor / Optometrist Name</label>
                <input type="text" placeholder="Dr. Sharma, Eye Specialist" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} style={{ ...inp, width: '100%', textAlign: 'left' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4A3A33', marginBottom: 4 }}>Pupillary Distance (PD mm)</label>
                <input type="number" value={pd} onChange={(e) => setPd(e.target.value)} style={{ ...inp, width: '100%', textAlign: 'left' }} />
              </div>
            </div>

            {/* Grid */}
            <div style={{ background: '#F6F1E8', borderRadius: 8, padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: '0.5rem', marginBottom: 6, fontWeight: 700, fontSize: '0.75rem', color: '#72785A' }}>
                <span>Eye</span>
                <span>SPH</span>
                <span>CYL</span>
                <span>Axis</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: '0.5rem', marginBottom: 6, alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>OD (Right)</span>
                <input value={sphR} onChange={(e) => setSphR(e.target.value)} style={inp} />
                <input value={cylR} onChange={(e) => setCylR(e.target.value)} style={inp} />
                <input value={axisR} onChange={(e) => setAxisR(e.target.value)} style={inp} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>OS (Left)</span>
                <input value={sphL} onChange={(e) => setSphL(e.target.value)} style={inp} />
                <input value={cylL} onChange={(e) => setCylL(e.target.value)} style={inp} />
                <input value={axisL} onChange={(e) => setAxisL(e.target.value)} style={inp} />
              </div>
            </div>

            <textarea placeholder="Clinical notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...inp, width: '100%', textAlign: 'left', marginBottom: '1.25rem' }} />

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" style={{ background: '#B65E43', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>
                Save Prescription
              </button>
              <button type="button" onClick={() => setFormOpen(false)} style={{ background: '#EDE5D4', color: '#30251F', border: 'none', padding: '0.75rem 1.25rem', borderRadius: 6, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Prescriptions List */}
      {prescriptions.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, padding: '3rem', textAlign: 'center', border: '1px solid #F0EAE0' }}>
          <FileText size={40} style={{ color: '#A89C8C', marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#30251F' }}>No saved prescriptions</h3>
          <p style={{ color: '#72785A', fontSize: '0.9rem', marginTop: '0.5rem' }}>Save your doctor prescription to auto-fill lens customizations during checkout.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {prescriptions.map((p) => (
            <div key={p._id} style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '1px solid #F0EAE0', boxShadow: '0 2px 10px rgba(48,37,31,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#30251F' }}>
                    {p.doctorName || 'Standard Prescription'}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#72785A' }}>
                    Saved on {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button onClick={() => handleDelete(p._id)} style={{ background: 'none', border: 'none', color: '#A89C8C', cursor: 'pointer', padding: 4 }}>
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ background: '#F6F1E8', borderRadius: 8, padding: '0.85rem', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                <p style={{ margin: '2px 0' }}><strong>OD (Right):</strong> SPH {p.rightEye?.sphere || 0} · CYL {p.rightEye?.cylinder || 0} · Axis {p.rightEye?.axis || 0}°</p>
                <p style={{ margin: '2px 0' }}><strong>OS (Left):</strong> SPH {p.leftEye?.sphere || 0} · CYL {p.leftEye?.cylinder || 0} · Axis {p.leftEye?.axis || 0}°</p>
                {p.pupillaryDistance && <p style={{ margin: '2px 0' }}><strong>PD:</strong> {p.pupillaryDistance} mm</p>}
              </div>

              {p.notes && <p style={{ fontSize: '0.78rem', color: '#72785A', margin: 0 }}>Note: {p.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
