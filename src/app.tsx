import {Suspense} from "react";
import TopBar from "./top-bar/top-bar";

const App = () => <Suspense fallback="Loading"><TopBar /></Suspense>;
export default App;