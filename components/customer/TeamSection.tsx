const TEAM = [
  { initials: 'TP', color: '#8B5CF6', name: 'Tithi Parikh', role: 'Team Leader · Research & Dev' },
  { initials: 'ND', color: '#4C1D95', name: 'Nakul Desai', role: 'Backend & Infrastructure' },
  { initials: 'AS', color: '#5B21B6', name: 'Aryan Sharma', role: 'UI/UX Developer' },
  { initials: 'AC', color: '#7C3AED', name: 'Aastha Chokshi', role: 'Designer & Developer' },
];

export default function TeamSection() {
  return (
    <section className="team-section" id="teamSection">
      <div className="section-wrap">
        <div className="section-top" style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="section-eyebrow" style={{ border: 'none', padding: 0, display: 'block' }}>
            MEET THE CREATORS
          </div>
          <h2 className="section-heading">The NEARBUY Team</h2>
        </div>
        <div className="team-grid">
          {TEAM.map((m) => (
            <div className="team-card" key={m.name}>
              <div className="tc-avatar" style={{ background: m.color }}>
                {m.initials}
              </div>
              <h3>{m.name}</h3>
              <div className="tc-role">{m.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}