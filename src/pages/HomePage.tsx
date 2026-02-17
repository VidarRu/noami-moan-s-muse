import Index from "./Index";
import About from "./About";
import Works from "./Works";
import Media from "./Media";
import Contact from "./Contact";

const HomePage = () => {
  return (
    <div>
      <div id="hem">
        <Index />
      </div>
      <div id="om">
        <About />
      </div>
      <div id="verk">
        <Works />
      </div>
      <div id="media">
        <Media />
      </div>
      <div id="kontakt">
        <Contact />
      </div>
    </div>
  );
};

export default HomePage;
