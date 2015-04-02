using JsTestAdapter.TestAdapter;
using System.Xml.Serialization;

namespace JasmineNodeTestAdapter.TestAdapter
{
    [XmlType(JasmineTestSettings.SettingsName)]
    public class JasmineTestSettings : TestSettings
    {
        public const string SettingsName = "JasmineTestSettings";

        public JasmineTestSettings()
            : base(SettingsName)
        {
        }
    }
}