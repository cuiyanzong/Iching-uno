import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 开发环境下加载调试工具
if (process.env.NODE_ENV === 'development') {
  import('./utils/scoreDebugger');
  import('./utils/testAutoUpload');
  import('./utils/syncFix');
}

createRoot(document.getElementById("root")!).render(<App />);
