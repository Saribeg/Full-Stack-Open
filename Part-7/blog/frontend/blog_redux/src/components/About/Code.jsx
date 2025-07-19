import PropTypes from 'prop-types';

const Code = ({ children }) => (
  <code className="rounded bg-[#0b1120] px-1.5 py-0.5 font-mono text-sm text-cyan-300">
    {children}
  </code>
);

Code.propTypes = {
  children: PropTypes.node.isRequired
};

export default Code;
