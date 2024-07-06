import "./assets/sass/app.scss"
import Footer from './Layouts/Footer';
import Header from './Layouts/Header';
import Nav from './Layouts/Nav';
import Main from './Layouts/Main';
import QuickView from "./pages/home/QuickView";
import NewsLetter from './Layouts/NewsLetter';
function App() {
  return (
    <div>
      <QuickView />
      <Header />
      <Nav />
      <Main />
      <NewsLetter />
      <Footer />
    </div >
  );
}

export default App;