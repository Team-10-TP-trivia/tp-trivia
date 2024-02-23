import PropTypes from 'prop-types';
import Navigation from '../components/Navigation/Navigation';
import Header from '../components/Header/Header';


/**
 * Component for the layout of the webpage.
 *
 * @component
 * @param {Object} props - Props for this component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} A component that displays the layout of the webpage, including the header, navigation, child components, and footer.
 */
const Layout = props =>  {
  return (
    <div>
      <Header />
      <Navigation />
      {props.children}
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout;