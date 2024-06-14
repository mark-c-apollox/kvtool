package cmd

import (
	"fmt"
	"strconv"

	"github.com/cometbft/cometbft/crypto/ed25519"
	"github.com/cometbft/cometbft/p2p"
	"github.com/cosmos/cosmos-sdk/codec"
	"github.com/spf13/cobra"
)

func NodeKeysCmd(cdc *codec.LegacyAmino) *cobra.Command {
	cmd := &cobra.Command{
		Use:     "node-keys number_of_keys",
		Short:   "Generate n node_key.json files",
		Long:    "Generates n node_key.json files in the current directory with names node_key_1.json ... node_key_n.json",
		Example: "node-keys 3",
		Args:    cobra.ExactArgs(1),
		RunE: func(_ *cobra.Command, args []string) error {
			n, err := strconv.ParseInt(args[0], 10, 64)
			if err != nil {
				return err
			}
			for i := int64(0); i < n; i++ {
				privKey := ed25519.GenPrivKey()
				nodeKey := &p2p.NodeKey{
					PrivKey: privKey,
				}
				fileName := fmt.Sprintf("node_key_%d.json", i)
				err = nodeKey.SaveAs(fileName)
				if err != nil {
					return err
				}
				fmt.Printf("%s node id: %s\n", fileName, nodeKey.ID())
			}
			return nil
		},
	}
	return cmd
}
