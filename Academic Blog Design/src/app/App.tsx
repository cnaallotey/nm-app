import { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ArticleCard } from './components/ArticleCard';
import { CVSidebar } from './components/CVSidebar';
import { FieldFilter } from './components/FieldFilter';
import { SearchBar } from './components/SearchBar';
import { StatsPanel } from './components/StatsPanel';
import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  const [selectedField, setSelectedField] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const articles = [
    {
      title: 'Reconfiguring Institutional Memory: Archival Practices in the Digital Age',
      author: 'Dr. Eleanor M. Hartwell',
      credentials: 'PhD, History of Science',
      field: 'Digital Humanities',
      date: 'March 2026',
      abstract:
        'This study examines how digitization transforms not merely the accessibility of archival materials, but fundamentally reshapes the epistemological frameworks through which we construct historical knowledge. Drawing on institutional ethnography across three national archives, I argue that digital affordances introduce new forms of temporal manipulation and spatial reconfiguration.',
      content: `The transformation of archival practice through digital technologies represents more than a mere shift in storage medium or retrieval mechanism. Rather, it constitutes a fundamental reordering of the relationship between documentation, memory, and historical knowledge production.

Through eighteen months of ethnographic observation across the National Archives (UK), the Bibliothèque nationale de France, and the Smithsonian Institution Archives, this research documents how archivists navigate the tension between preserving material authenticity and enabling digital accessibility. The act of digitization, far from being neutral translation, involves countless micro-decisions about resolution, color correction, metadata schema, and interface design—each inscribing new layers of interpretation onto historical materials.

Of particular significance is the emergence of what I term "temporal plasticity"—the capacity of digital archives to disaggregate documents from their original chronological and spatial contexts, enabling users to reconfigure collections according to algorithmic, thematic, or idiosyncratic logics. This represents a profound departure from the physical archive's inherent constraint of linear browsing and spatial adjacency.

The implications extend beyond archival science to fundamental questions in epistemology and historiography. If the archive shapes historical consciousness, then the transition from physical to digital archives signals not merely improved access but a transformation in the very nature of historical knowledge itself.`,
      citations: 127,
      journalName: 'Journal of Digital History',
      featured: true,
      keywords: ['Digital Archives', 'Epistemology', 'Institutional Ethnography', 'Historical Knowledge'],
    },
    {
      title: 'The Materiality of Metadata: Classification Systems and Colonial Legacies',
      author: 'Dr. Eleanor M. Hartwell',
      credentials: 'PhD, History of Science',
      field: 'Postcolonial Studies',
      date: 'January 2026',
      abstract:
        'Metadata classification systems inherited from colonial administrations continue to structure contemporary digital archives, perpetuating epistemic violence through taxonomic categories that reflect imperial worldviews. This article traces the genealogy of subject headings and classification schemas.',
      content: `The seemingly neutral technical apparatus of metadata classification conceals profound political and epistemic assumptions. Contemporary digital archives overwhelmingly rely on classification systems—Library of Congress Subject Headings, Dewey Decimal Classification, UNESCO Thesaurus—that were developed during the height of European imperialism and reflect distinctly colonial ways of organizing knowledge.

These systems embed hierarchies that privilege Western epistemologies while marginalizing or erasing indigenous knowledge structures. Terms like "primitive," "tribe," and "discovery" persist in authoritative vocabularies, encoding colonial perspectives as ostensibly objective descriptors. Geographic categories divide the world according to imperial spheres of influence rather than indigenous territorial configurations.

The material consequences are substantial: researchers seeking materials on indigenous histories must often navigate subject headings that render these cultures as objects of anthropological study rather than as autonomous knowledge producers. The classification system itself becomes a technology of colonial dispossession, determining what can be found and therefore what can be known.

Decolonizing metadata requires not merely updating offensive terminology but fundamentally reimagining classificatory logic to accommodate multiple, potentially incommensurable ontologies. This represents a profound technical and philosophical challenge for information science.`,
      citations: 89,
      journalName: 'Critical Archival Studies',
      keywords: ['Metadata', 'Decolonization', 'Classification Systems', 'Postcolonial Theory'],
    },
    {
      title: 'Toward a Phenomenology of the Digital Document',
      author: 'Dr. Eleanor M. Hartwell',
      credentials: 'PhD, History of Science',
      field: 'Media Studies',
      date: 'November 2025',
      abstract:
        'What constitutes a "document" in digital space? This theoretical investigation draws on phenomenology and media archaeology to examine how digital documents differ from their material predecessors not merely in format but in their fundamental mode of being.',
      content: `The digital document presents a philosophical puzzle: it appears to possess properties fundamentally incompatible with traditional documentary forms while simultaneously claiming documentary authority. Unlike paper documents, digital files exist as mutable patterns of magnetic or electrical states, lacking the material stability that traditionally underwrote documentary authenticity.

Drawing on Husserl's phenomenology and recent work in media archaeology, I propose that digital documents should be understood not as dematerialized versions of physical texts but as fundamentally different entities—processual rather than static, dependent on computational interpretation rather than direct perception, distributed across networked infrastructure rather than localized in singular objects.

This reconceptualization has significant implications for archival theory, legal frameworks around documentary evidence, and our understanding of textual authority in digital contexts. The digital document's essential mutability—the ease with which it can be copied, modified, version-controlled, and transmitted—challenges foundational assumptions about fixity and authenticity that have structured documentary cultures for centuries.

Rather than lamenting this instability, we might recognize it as opening new possibilities for collective authorship, living documents, and more flexible forms of textual relationship. The digital document invites us to reimagine what documentation can be.`,
      citations: 64,
      journalName: 'Media Theory',
      keywords: ['Phenomenology', 'Media Archaeology', 'Digital Documents', 'Textual Authority'],
    },
  ];

  const cvData = {
    name: 'Dr. Eleanor M. Hartwell',
    credentials: 'PhD, History of Science',
    institution: 'University of Cambridge',
    researchInterests: [
      'Digital Humanities',
      'Archival Theory',
      'Postcolonial Studies',
      'Media Archaeology',
      'Science & Technology Studies',
    ],
    recentPublications: [
      {
        year: '2026',
        title: 'Reconfiguring Institutional Memory',
        journal: 'J. Digital History',
      },
      {
        year: '2026',
        title: 'The Materiality of Metadata',
        journal: 'Critical Archival Studies',
      },
      {
        year: '2025',
        title: 'Toward a Phenomenology of the Digital Document',
        journal: 'Media Theory',
      },
      {
        year: '2025',
        title: 'Archive Fever in the Age of Big Data',
        journal: 'New Media & Society',
      },
      {
        year: '2024',
        title: 'Colonial Taxonomies in Museum Databases',
        journal: 'Museum Anthropology',
      },
    ],
    email: 'e.hartwell@cambridge.ac.uk',
  };

  const allFields = [...new Set(articles.map((a) => a.field))];

  const totalCitations = articles.reduce((sum, article) => sum + article.citations, 0);
  const archiveStats = [
    { label: 'Publications', value: articles.length },
    { label: 'Citations', value: totalCitations },
    { label: 'Research Fields', value: allFields.length },
    { label: 'Years Active', value: '12+' },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesField = selectedField === 'All' || article.field === selectedField;
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesField && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Header />
      {/* <Navigation /> */}

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      <FieldFilter
        fields={allFields}
        selectedField={selectedField}
        onFieldSelect={setSelectedField}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          {/* Sidebar Column - appears first on mobile */}
          <aside className="lg:order-2">
            <CVSidebar {...cvData} />
          </aside>

          {/* Main Content Column */}
          <main className="lg:order-1">
            {/* Article Count */}
            <div
              className="text-center mb-8 pb-6 border-b border-border"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span className="text-[11px] uppercase tracking-[0.15em] opacity-40">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'Article' : 'Articles'} Found
              </span>
            </div>

            {filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <div
                  key={index}
                  style={{
                    animationDelay: `${0.6 + index * 0.15}s`,
                  }}
                >
                  <ArticleCard {...article} />
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div
                  className="text-[2rem] mb-4 opacity-20"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}
                >
                  No Articles Found
                </div>
                <p
                  className="text-[15px] opacity-50 max-w-md mx-auto"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  No articles match your current search or filter criteria. Try adjusting your search terms or selecting a different research field.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-primary mt-16 py-8">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div
            className="text-[11px] uppercase tracking-[0.15em] opacity-40"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            © 2026 Dr. Eleanor M. Hartwell · All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}