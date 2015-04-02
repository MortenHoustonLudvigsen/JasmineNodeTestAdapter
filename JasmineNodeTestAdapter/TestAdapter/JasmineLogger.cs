using JsTestAdapter.Logging;
using Microsoft.VisualStudio.TestPlatform.ObjectModel.Logging;
using Microsoft.VisualStudio.TestWindow.Extensibility;
using System.IO;

namespace JasmineNodeTestAdapter.TestAdapter
{
    public class JasmineLogger : TestLogger
    {
        public JasmineLogger(ILogger logger, bool newGlobalLog = false)
            : this(logger, null, newGlobalLog)
        {
        }

        public JasmineLogger(IMessageLogger messageLogger, bool newGlobalLog = false)
            : this(null, messageLogger, newGlobalLog)
        {
        }

        private JasmineLogger(ILogger logger, IMessageLogger messageLogger, bool newGlobalLog)
        {
            AddContext("Jasmine");
            if (Globals.Debug)
            {
                if (!Directory.Exists(Globals.GlobalLogDir))
                {
                    Directory.CreateDirectory(Globals.GlobalLogDir);
                }
                if (newGlobalLog && File.Exists(Globals.GlobalLogFile))
                {
                    File.Delete(Globals.GlobalLogFile);
                }
                this.Info("Logging to {0}", Globals.GlobalLogFile);
                this.AddLogger(Globals.GlobalLogFile);
            }
            this.AddLogger(logger);
            this.AddLogger(messageLogger);
        }
    }
}