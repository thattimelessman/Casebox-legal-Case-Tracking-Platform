import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Card, CardHeader, CardBody, Badge, Btn, Modal, Input, Textarea,
  ProgressBar, SectionLabel, Timeline, FileItem, EmptyState,
} from "../../components/ui";
import { SketchGavel, SketchFolder, SketchNotepad, SketchPen, SketchScales } from "../../illustrations/Sketches";
import { toast } from "../../components/ui";

export default function CaseDetail({ caseId, onBack }) {
  const { getCaseById, user, updateCase, addHearingNote, addComment, getUserById } = useAuth();
  const c = getCaseById(caseId);

  const [noteModal, setNoteModal] = useState(false);
  const [progModal, setProgModal] = useState(false);
  const [commentModal, setComModal] = useState(false);
  const [noteForm, setNoteForm] = useState({ hearing_date:"", next_date:"", note:"" });
  const [newProg, setNewProg]   = useState(c?.progress || 0);
  const [commentText, setComText] = useState("");

  if (!c) return (
    <div style={{ padding:40, textAlign:"center" }}>
      <EmptyState icon={<SketchNotepad size={60} />} title="Case not found" desc="This case does not exist or you don't have access." />
      <Btn variant="ghost" onClick={onBack} style={{ marginTop:16 }}>← Go Back</Btn>
    </div>
  );

  const isAdmin    = user.role === "admin";
  const isAdvocate = user.role === "advocate";
  const canNote    = isAdmin || isAdvocate;
  const canEdit    = isAdmin;

  const name = id => {
    const u = getUserById(id);
    return u ? `${u.first_name} ${u.last_name}` : "—";
  };

  const saveNote = () => {
    if (!noteForm.hearing_date || !noteForm.note) { toast("Date and note required.","error"); return; }
    addHearingNote(c.id, noteForm);
    toast("Hearing note added.","success");
    setNoteModal(false);
    setNoteForm({ hearing_date:"", next_date:"", note:"" });
  };

  const saveProgress = () => {
    const val = Math.min(100, Math.max(0, Number(newProg)));
    updateCase(c.id, { progress: val });
    toast("Progress updated.","success");
    setProgModal(false);
  };

  const saveComment = () => {
    if (!commentText.trim()) return;
    addComment(c.id, commentText.trim());
    toast("Comment added.","success");
    setComModal(false);
    setComText("");
  };

  const timelineItems = c.hearing_notes.map(n => ({
    date: n.hearing_date,
    text: n.note,
    next: n.next_date,
  }));

  return (
    <div>
      {/* back + header */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:24 }}>
        <button onClick={onBack} style={{
          background:"none", border:"1px solid #d6cfc2", borderRadius:6,
          padding:"7px 14px", cursor:"pointer", color:"#7a7a8a", fontSize:"0.82rem",
          transition:"all 0.15s", marginTop:4,
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor="#4a7c6f"}
          onMouseLeave={e => e.currentTarget.style.borderColor="#d6cfc2"}>
          ← Back
        </button>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.78rem", color:"#7a7a8a" }}>{c.case_no}</span>
            <Badge label={c.status}   variant={c.status} />
            <Badge label={c.priority} variant={c.priority} />
            <Badge label={c.case_type} variant={c.case_type} />
          </div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.8rem", fontWeight:300, color:"#1a2744", lineHeight:1.2 }}>
            {c.case_title}
          </h1>
          <div style={{ fontSize:"0.82rem", color:"#7a7a8a", marginTop:4 }}>
            {c.court_name}{c.court_city ? ` · ${c.court_city}` : ""}
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {canNote   && <Btn variant="sage"  size="sm" onClick={() => setNoteModal(true)}>+ Hearing Note</Btn>}
          {canEdit   && <Btn variant="ghost" size="sm" onClick={() => setProgModal(true)}>Set Progress</Btn>}
          {canNote   && <Btn variant="ghost" size="sm" onClick={() => setComModal(true)}>+ Comment</Btn>}
        </div>
      </div>

      {/* progress bar full-width */}
      <Card style={{ marginBottom:16, padding:"16px 22px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontSize:"0.78rem", color:"#7a7a8a", textTransform:"uppercase", letterSpacing:"0.06em" }}>Case Progress</span>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", fontWeight:600, color:"#1a2744" }}>{c.progress}%</span>
        </div>
        <ProgressBar value={c.progress} showLabel={false} />
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>

        {/* people */}
        <Card noPad>
          <CardHeader title="Case Parties" />
          <CardBody>
            {[
              { label:"Client",               id:c.client,              icon:"◎" },
              { label:"Client Advocate",       id:c.client_advocate,     icon:"⚖" },
              { label:"Opposition Advocate",   id:c.opposition_advocate, icon:"⚖" },
              { label:"Presiding Judge",       id:c.judge,               icon:"🏛" },
            ].map((r, i) => r.id && (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"9px 0", borderBottom:"1px solid #ede8df",
              }}>
                <div style={{
                  width:32, height:32, borderRadius:"50%",
                  background:"rgba(74,124,111,0.1)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"0.8rem", flexShrink:0,
                }}>{r.icon}</div>
                <div>
                  <div style={{ fontSize:"0.74rem", color:"#7a7a8a", textTransform:"uppercase", letterSpacing:"0.05em" }}>{r.label}</div>
                  <div style={{ fontSize:"0.86rem", fontWeight:500, color:"#1a1a2e" }}>{name(r.id)}</div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* dates + summary */}
        <Card noPad>
          <CardHeader title="Case Details" />
          <CardBody>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              {[
                { label:"Filing Date",    val:c.filing_date       || "—" },
                { label:"Last Hearing",   val:c.last_hearing_date || "—" },
                { label:"Next Hearing",   val:c.next_hearing_date || "—" },
                { label:"Tags",           val:c.tags || "—" },
              ].map((d,i) => (
                <div key={i}>
                  <div style={{ fontSize:"0.68rem", color:"#7a7a8a", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:3 }}>{d.label}</div>
                  <div style={{ fontSize:"0.86rem", color:"#1a1a2e" }}>{d.val}</div>
                </div>
              ))}
            </div>
            {c.case_summary && (
              <>
                <div style={{ fontSize:"0.68rem", color:"#7a7a8a", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Summary</div>
                <p style={{ fontSize:"0.85rem", color:"#1a1a2e", lineHeight:1.7, fontWeight:300 }}>{c.case_summary}</p>
              </>
            )}
            {c.last_verdict && (
              <>
                <div style={{ fontSize:"0.68rem", color:"#7a7a8a", textTransform:"uppercase", letterSpacing:"0.07em", marginTop:12, marginBottom:6 }}>Last Verdict</div>
                <p style={{ fontSize:"0.85rem", color:"#1a1a2e", lineHeight:1.7, fontStyle:"italic", fontFamily:"'Cormorant Garamond',serif" }}>{c.last_verdict}</p>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>

        {/* hearing timeline */}
        <Card noPad>
          <CardHeader title="Hearing History" action={
            <span style={{ fontSize:"0.74rem", color:"#7a7a8a" }}>{c.hearing_notes.length} entries</span>
          } />
          <CardBody>
            {timelineItems.length > 0
              ? <Timeline items={timelineItems} />
              : <EmptyState icon={<SketchGavel size={44} />} title="No hearings yet" desc="Hearing notes will appear here." />}
          </CardBody>
        </Card>

        {/* documents */}
        <Card noPad>
          <CardHeader title="Documents" action={
            <span style={{ fontSize:"0.74rem", color:"#7a7a8a" }}>{c.documents.length} files</span>
          } />
          <CardBody>
            {c.documents.length > 0
              ? c.documents.filter(d => user.role !== "client" || d.is_visible_to_client).map(d => (
                <FileItem key={d.id} title={d.title} side={d.side}
                  visible={d.is_visible_to_client}
                  meta={`${d.file_type} · ${d.upload_date?.split("T")[0] || "—"}`}
                  onDownload={() => toast("Download ready (mock).", "info")}
                  onToggle={isAdmin ? () => toast("Visibility toggled (mock).", "info") : null}
                />
              ))
              : <EmptyState icon={<SketchFolder size={44} />} title="No documents" desc="Documents attached to this case appear here." />}
          </CardBody>
        </Card>
      </div>

      {/* comments — admin/advocate only */}
      {(isAdmin || isAdvocate) && (
        <Card noPad>
          <CardHeader title="Internal Comments" action={
            <span style={{ fontSize:"0.74rem", color:"#7a7a8a" }}>Visible to advocates & admin only</span>
          } />
          <CardBody>
            {c.comments.length > 0 ? c.comments.map((cm, i) => (
              <div key={cm.id} style={{
                padding:"12px 14px", background:"#f8f4ed", borderRadius:8,
                marginBottom:8, border:"1px solid #d6cfc2",
              }}>
                <div style={{ fontSize:"0.74rem", color:"#7a7a8a", marginBottom:5 }}>
                  {cm.author_name || name(cm.author)} · {new Date(cm.created_at).toLocaleDateString("en-IN")}
                </div>
                <p style={{ fontSize:"0.86rem", color:"#1a1a2e", lineHeight:1.6 }}>{cm.text}</p>
              </div>
            )) : (
              <EmptyState icon={<SketchPen size={44} />} title="No comments yet" desc="Add internal notes for your team." />
            )}
          </CardBody>
        </Card>
      )}

      {/* MODALS */}
      <Modal open={noteModal} onClose={() => setNoteModal(false)} title="Add Hearing Note"
        footer={<>
          <Btn variant="ghost" onClick={() => setNoteModal(false)}>Cancel</Btn>
          <Btn variant="sage"  onClick={saveNote}>Save Note</Btn>
        </>}>
        <Input label="Hearing Date *" id="hd" type="date" value={noteForm.hearing_date}
          onChange={e => setNoteForm(f=>({...f, hearing_date:e.target.value}))} required />
        <Input label="Next Date" id="nd" type="date" value={noteForm.next_date}
          onChange={e => setNoteForm(f=>({...f, next_date:e.target.value}))} />
        <Textarea label="Note *" id="nt" value={noteForm.note}
          onChange={e => setNoteForm(f=>({...f, note:e.target.value}))} rows={4} />
      </Modal>

      <Modal open={progModal} onClose={() => setProgModal(false)} title="Update Progress"
        footer={<>
          <Btn variant="ghost" onClick={() => setProgModal(false)}>Cancel</Btn>
          <Btn variant="sage"  onClick={saveProgress}>Update</Btn>
        </>}>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:"0.8rem", color:"#7a7a8a", marginBottom:12 }}>Current: {c.progress}%</div>
          <ProgressBar value={Number(newProg)} />
        </div>
        <Input label="New Progress %" id="np" type="number" value={newProg}
          onChange={e => setNewProg(e.target.value)} />
      </Modal>

      <Modal open={commentModal} onClose={() => setComModal(false)} title="Add Internal Comment"
        footer={<>
          <Btn variant="ghost" onClick={() => setComModal(false)}>Cancel</Btn>
          <Btn variant="sage"  onClick={saveComment}>Add Comment</Btn>
        </>}>
        <Textarea label="Comment" id="cm" value={commentText}
          onChange={e => setComText(e.target.value)} rows={4}
          placeholder="Internal note — visible only to advocates and admin." />
      </Modal>
    </div>
  );
}
