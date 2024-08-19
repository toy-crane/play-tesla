import { index } from "google-indexing-script";
import serviceAccount from "../service_account.json";

index("playtesla.xyz", {
  client_email: serviceAccount.client_email,
  private_key: serviceAccount.private_key,
  quota: {
    rpmRetry: true,
  },
})
  .then(console.log)
  .catch(console.error);
