using JsTestAdapter.Logging;
using System.Text.RegularExpressions;

namespace JasmineNodeTestAdapter.TestAdapter
{
    public class JasmineServerTestLogger : TestServerLogger
    {
        public JasmineServerTestLogger(ITestLogger logger)
            : base(logger)
        {
        }

        private static Regex messageRe = new Regex(@"^(INFO|WARN|ERROR|DEBUG)\s*(.*)$");
        public override void Log(string message)
        {
            if (string.IsNullOrWhiteSpace(message))
            {
                return;
            }
            var match = messageRe.Match(message);
            if (match.Success)
            {
                switch (match.Groups[1].Value)
                {
                    case "INFO":
                        this.Debug(message);
                        break;
                    case "WARN":
                        this.Warn(message);
                        break;
                    case "ERROR":
                        this.Error(message);
                        break;
                    case "DEBUG":
                        this.Debug(message);
                        break;
                    default:
                        this.Debug(message);
                        break;
                }
            }
            else
            {
                this.Debug(message);
            }
        }
    }
}