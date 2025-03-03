import { initFederation } from "@softarc/native-federation";

(async () => {
  console.time("nf-shell");

  console.time("nf-shell-init");

  await initFederation({
    product: "http://localhost:3001/remoteEntry.json",
    service: "http://localhost:3002/remoteEntry.json",
  });

  console.timeEnd("nf-shell-init");

  await import("./bootstrap");
})();
