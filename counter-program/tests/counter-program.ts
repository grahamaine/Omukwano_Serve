import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { assert } from "chai";
import { CounterProgram } from "../target/types/counter_program";

describe("counter-program", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const program = anchor.workspace.counterProgram as Program<CounterProgram>;

  const [counterPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("anchor"), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  it("initializes the counter at 0", async () => {
    await program.methods.initialize().rpc();
    const counter = await program.account.counter.fetch(counterPda);
    assert.equal(counter.count.toNumber(), 0);
  });

  // TODO (you): after finishing `increment`, add a test that calls it
  // and checks count === 1, and one that a different wallet is rejected.
});
