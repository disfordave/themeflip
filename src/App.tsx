import "./App.css";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <>
      <header>
        <h1>ThemeToggle playground</h1>
      </header>
      <main>
        <h2>Examples</h2>
        <section
          style={{
            marginBottom: 16,
          }}
        >
          <h3>Basic</h3>
          <ThemeToggle />
          <pre>{`<ThemeToggle />`}</pre>
        </section>
        <hr />
        <section>
          <h3>Custom</h3>
          <ThemeToggle
            addDarkClass
            system={{ label: "System" }}
            light={{ label: "Day" }}
            dark={{ label: "Night" }}
            onThemeChange={(theme) => {
              console.log(theme);
            }}
          />
          <pre>
            {`<ThemeToggle
  addDarkClass
  system={{ label: "System" }}
  light={{ label: "Day" }}
  dark={{ label: "Night" }}
  onThemeChange={(theme) => {
    console.log(theme);
  }}
/>`}
          </pre>
        </section>
      </main>
      <footer>
        <p>
          &copy; 2026{" "}
          <a href="https://hsw.is" target="_blank" rel="noopener noreferrer">
            HSW.is
          </a>
        </p>
      </footer>
    </>
  );
}

export default App;
