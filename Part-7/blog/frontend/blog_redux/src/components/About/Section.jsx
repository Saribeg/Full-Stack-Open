import PropTypes from 'prop-types';
import SectionHeader from './SectionHeader';

const Section = ({ icon, title, children }) => (
  <section>
    <SectionHeader icon={icon} title={title} />
    <div className="space-y-4 text-cyan-100/80">{children}</div>
  </section>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired
};

export default Section;
