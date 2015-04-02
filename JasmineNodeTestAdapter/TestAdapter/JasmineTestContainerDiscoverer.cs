using JsTestAdapter.TestAdapter;
using Microsoft.VisualStudio.Shell;
using Microsoft.VisualStudio.Shell.Interop;
using Microsoft.VisualStudio.TestWindow.Extensibility;
using System;
using System.ComponentModel.Composition;

namespace JasmineNodeTestAdapter.TestAdapter
{
    [Export(typeof(ITestContainerDiscoverer))]
    public class JasmineTestContainerDiscoverer : TestContainerDiscoverer
    {
        [ImportingConstructor]
        public JasmineTestContainerDiscoverer(
            [Import(typeof(SVsServiceProvider))] IServiceProvider serviceProvider,
            ITestsService testsService,
            JasmineTestSettingsProvider testSettingsService,
            ILogger logger
            )
            : base(serviceProvider, testsService, testSettingsService, new JasmineLogger(logger, true))
        {
        }

        public override TestAdapterInfo CreateTestAdapterInfo()
        {
            return new JasmineTestAdapterInfo();
        }

        public override TestContainer CreateTestContainer(TestContainerSource source)
        {
            return new JasmineTestContainer(Containers, source.Project, source.Source);
        }

        public override TestContainerSource CreateTestContainerSource(IVsProject project, string source)
        {
            return new JasmineTestContainerSource(project, source);
        }
    }
}