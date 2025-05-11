import Slider from "../Banner/Slider";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import Carousel from "../CrasouleSample/Carosule";

function Dashboard() {
  return (
    <div>
      <Header />
      <Slider />
      <Carousel title="Sci-Fi" genre="Si-Fi" />
      <Carousel title="Thriller" genre="Thriller" />
      <Carousel title="Action" genre="Action" />
      <Footer />
    </div>
  );
}

export default Dashboard;