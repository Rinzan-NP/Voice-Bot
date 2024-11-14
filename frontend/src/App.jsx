import { useState } from "react";

import "./App.css";
import SpeechToTextConverter from "./components/SpeechToTextConverter";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<SpeechToTextConverter />
		</>
	);
}

export default App;
