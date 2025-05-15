import Slider from "../Banner/Slider";
import Footer from "../Common/Footer";
import Carousel from "../CrasouleSample/Carosule";

function Dashboard() {
  return (
    <div>
      <Slider />
      <Carousel title="Sci-Fi" genre="Si-Fi" />
      <Carousel title="Thriller" genre="Thriller" />
      <Carousel title="Action" genre="Action" />
      <Footer />
    </div>
  );
}

export default Dashboard;