/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/counter_program.json`.
 */
export type CounterProgram = {
  "address": "9dLzUWtKppSVHsBBAAea7nqhWUy2pzY3E19PrnGdP2Q4",
  "metadata": {
    "name": "counterProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createJob",
      "discriminator": [
        178,
        130,
        217,
        110,
        100,
        27,
        82,
        119
      ],
      "accounts": [
        {
          "name": "customer",
          "writable": true,
          "signer": true
        },
        {
          "name": "job",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  106,
                  111,
                  98
                ]
              },
              {
                "kind": "account",
                "path": "customer"
              },
              {
                "kind": "arg",
                "path": "jobId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "jobId",
          "type": "u64"
        },
        {
          "name": "provider",
          "type": "pubkey"
        },
        {
          "name": "mint",
          "type": "pubkey"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "reference",
          "type": "string"
        },
        {
          "name": "attestor",
          "type": "pubkey"
        },
        {
          "name": "deadline",
          "type": "i64"
        }
      ]
    },
    {
      "name": "fundJob",
      "discriminator": [
        244,
        198,
        4,
        15,
        41,
        178,
        169,
        187
      ],
      "accounts": [
        {
          "name": "customer",
          "writable": true,
          "signer": true,
          "relations": [
            "job"
          ]
        },
        {
          "name": "job",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  106,
                  111,
                  98
                ]
              },
              {
                "kind": "account",
                "path": "customer"
              },
              {
                "kind": "account",
                "path": "job.job_id",
                "account": "job"
              }
            ]
          }
        },
        {
          "name": "mint",
          "relations": [
            "job"
          ]
        },
        {
          "name": "customerTokenAccount",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "job"
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "counter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  110,
                  99,
                  104,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "release",
      "discriminator": [
        253,
        249,
        15,
        206,
        28,
        127,
        193,
        241
      ],
      "accounts": [
        {
          "name": "attestor",
          "docs": [
            "The confirmation service. It signs only after checking the customer's SMS code off-chain."
          ],
          "signer": true,
          "relations": [
            "job"
          ]
        },
        {
          "name": "job",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  106,
                  111,
                  98
                ]
              },
              {
                "kind": "account",
                "path": "job.customer",
                "account": "job"
              },
              {
                "kind": "account",
                "path": "job.job_id",
                "account": "job"
              }
            ]
          }
        },
        {
          "name": "mint",
          "relations": [
            "job"
          ]
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "job"
              }
            ]
          }
        },
        {
          "name": "providerTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "counter",
      "discriminator": [
        255,
        176,
        4,
        245,
        188,
        253,
        124,
        25
      ]
    },
    {
      "name": "job",
      "discriminator": [
        75,
        124,
        80,
        203,
        161,
        180,
        202,
        80
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "overflow",
      "msg": "Counter overflow"
    },
    {
      "code": 6001,
      "name": "invalidAmount",
      "msg": "Amount must be greater than zero"
    },
    {
      "code": 6002,
      "name": "deadlineInPast",
      "msg": "Deadline must be in the future"
    },
    {
      "code": 6003,
      "name": "wrongStatus",
      "msg": "Job is not in the right status for this action"
    },
    {
      "code": 6004,
      "name": "invalidReference",
      "msg": "Reference must be 2-8 uppercase letters or digits"
    },
    {
      "code": 6005,
      "name": "notAttestor",
      "msg": "Only the confirmation service can release funds"
    },
    {
      "code": 6006,
      "name": "notProvider",
      "msg": "Only the provider can do this"
    },
    {
      "code": 6007,
      "name": "notCustomer",
      "msg": "Only the customer can do this"
    },
    {
      "code": 6008,
      "name": "tooEarly",
      "msg": "The deadline has not passed yet"
    }
  ],
  "types": [
    {
      "name": "counter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "count",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "job",
      "docs": [
        "One service booking: a customer pays a provider once the work is confirmed."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "customer",
            "type": "pubkey"
          },
          {
            "name": "provider",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "reference",
            "type": "string"
          },
          {
            "name": "attestor",
            "type": "pubkey"
          },
          {
            "name": "deadline",
            "type": "i64"
          },
          {
            "name": "jobId",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "jobStatus"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "jobStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "created"
          },
          {
            "name": "funded"
          },
          {
            "name": "released"
          },
          {
            "name": "cancelled"
          },
          {
            "name": "refunded"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "jobSeed",
      "type": "string",
      "value": "\"job\""
    },
    {
      "name": "seed",
      "type": "string",
      "value": "\"anchor\""
    }
  ]
};
