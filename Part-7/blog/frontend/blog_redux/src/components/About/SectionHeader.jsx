import PropTypes from 'prop-types';

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="mb-4 flex items-center gap-2">
    <Icon className="text-2xl text-indigo-600" />
    <h2 className="text-2xl font-semibold text-white">{title}</h2>
  </div>
);

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired
};

export default SectionHeader;
