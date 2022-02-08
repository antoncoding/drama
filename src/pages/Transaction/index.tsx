import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { defaultTxPlaceHolder } from "../../types";
import {
  Box,
  TransactionBadge,
  ButtonBase,
  useTheme,
  IconShare,
  IconStar,
  IconStarFilled,
  useToast,
  Popover,
} from "@aragon/ui";

import { TwitterShareButton, TwitterIcon } from "react-share";

// import { timeSince } from "../../utils/time";
import { Body3, Title2, Title1 } from "../../components/aragon";
import { BoxLoading } from "react-loadingg";

import { Avatar } from "../../components/Avatar";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { parseTwitterStatusId } from "../../utils/media";
import { getLikedTxs, storeLikedTxs } from "../../utils/storage";
import { useAsyncMemo } from "../../hooks/useAsyncMemo";
import { getBlockTimestamp, getParsedTx } from "../../utils/web3";
import { VerticalAlignWrapper } from "../../components/Wrapper/VerticalAlignWrapper";

export function Transaction() {
  const [liked, setLiked] = useState(false);

  const [showSharePopover, setShowShare] = useState(false);
  const opener = useRef();

  const [isLoading, setIsLoading] = useState(true);

  const { hash } = useParams();

  const tx = useAsyncMemo(
    async () => {
      try {
        setIsLoading(true);
        let msg = await getParsedTx(hash);
        const timestamp = (await getBlockTimestamp(msg.blockNumber)) as string;
        msg.timeStamp = timestamp;
        return msg;
      } finally {
        setIsLoading(false);
      }
    },
    [],
    defaultTxPlaceHolder
  );

  const recipient = useMemo(() => {
    return tx.adapterRecipient || tx.to;
  }, [tx]);

  const adapterName = useMemo(() => tx.adapterName, [tx.adapterName]);

  const toast = useToast();

  const theme = useTheme();

  const twitterStatusId = useMemo(() => {
    return parseTwitterStatusId(tx.parsedMessage);
  }, [tx.parsedMessage]);

  useEffect(() => {
    const txs = getLikedTxs();
    const isLiked = txs.map((tx) => tx.hash).includes(tx.hash);
    setLiked(isLiked);
  }, [tx.hash]);

  const clickLike = useCallback(() => {
    if (tx.parsedMessage.length === 0) {
      toast("Cannot save an empty message");
      return;
    }
    const txs = getLikedTxs();
    const isLiked = txs.map((tx) => tx.hash).includes(tx.hash);
    if (isLiked) {
      // removed from liked array
      const newTxs = txs.filter((savedTx) => savedTx.hash !== tx.hash);
      storeLikedTxs(newTxs);
      setLiked(false);
      toast("Transaction removed from liked");
    } else {
      // add to liked array
      const newTxs = txs.concat([tx]);
      storeLikedTxs(newTxs);
      setLiked(true);
      toast("Transaction added to liked");
    }
  }, [tx, toast]);

  return isLoading ? (
    <BoxLoading />
  ) : (
    <div style={{ padding: 20 }}>
      <VerticalAlignWrapper>
        <Title1> Transaction </Title1>
        <ButtonBase
          style={{ display: "inline-block" }}
          onClick={() =>
            (window as any)
              .open(`https://etherscan.io/tx/${tx.hash}`, "_blank")
              .focus()
          }
        >
          <TransactionBadge transaction={tx.hash} />
        </ButtonBase>
      </VerticalAlignWrapper>
      <br />
      <Box>
        <div style={{ paddingBottom: "1%", position: "relative" }}>
          {/* from address */}
          <VerticalAlignWrapper>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "auto",
                paddingRight: 5,
              }}
            >
              {" "}
              From:{" "}
            </div>
            <Avatar account={tx.from} scale={1} size={30} showAddress={true} />
            <br />
          </VerticalAlignWrapper>

          {/* to address */}
          <VerticalAlignWrapper>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "auto",
                paddingRight: 5,
              }}
            >
              {" "}
              To:{" "}
            </div>
            <Avatar
              account={recipient}
              scale={1}
              size={30}
              showAddress={true}
              isSpecialEntity={!tx.adapterRecipientIsAddress}
              entityLink={tx.adapterRecipientLink}
            />
            <br />
            {adapterName && (
              <div style={{ marginTop: "auto", marginBottom: "auto" }}>
                through{" "}
                {
                  <span style={{ color: theme.surfaceContentSecondary }}>
                    {" "}
                    {adapterName}{" "}
                  </span>
                }
              </div>
            )}
          </VerticalAlignWrapper>

          {/* Gas cost */}
          <VerticalAlignWrapper style={{ paddingTop: 10 }}>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "auto",
                paddingRight: 5,
              }}
            >
              {" "}
              Gas cost:{" "}
            </div>
            <div style={{ color: theme.surfaceContentSecondary }}>
              {" "}
              {parseInt(tx.gasUsed, 16)}{" "}
            </div>
          </VerticalAlignWrapper>

          {/* Gas cost */}
          <VerticalAlignWrapper style={{ paddingTop: 10 }}>
            <div
              style={{
                marginTop: "auto",
                marginBottom: "auto",
                paddingRight: 5,
              }}
            >
              {" "}
              Value:{" "}
            </div>
            <div style={{ color: theme.surfaceContentSecondary }}>
              {" "}
              {(parseInt(tx.value, 16) / 1e18).toFixed(2)} ETH{" "}
            </div>
          </VerticalAlignWrapper>

          {/* buttons, fix at top right corner */}
          <VerticalAlignWrapper
            style={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <ButtonBase onClick={clickLike} style={{ paddingRight: 5 }}>
              {liked ? <IconStarFilled /> : <IconStar />}
            </ButtonBase>
            <ButtonBase onClick={() => setShowShare(true)} ref={opener}>
              {<IconShare />}
            </ButtonBase>
          </VerticalAlignWrapper>
        </div>

        <div>
          <Title2>Message: </Title2>
          <Body3
            style={{
              paddingTop: "2%",
              paddingBottom: "4%",
              whiteSpace: "pre-line",
              overflow: "hidden",
              fontSize: 20,
            }}
          >
            {tx.parsedMessage.length > 0
              ? tx.parsedMessage
              : "Cannot parsed this transaction."}

            {/* show tweet embed */}
            <div>
              {twitterStatusId && (
                <TwitterTweetEmbed tweetId={twitterStatusId} />
              )}
            </div>
          </Body3>
        </div>
      </Box>

      {/* // share popup */}
      <Popover
        visible={showSharePopover}
        opener={opener.current}
        onClose={() => setShowShare(false)}
      >
        <Box>
          <Body3> Share </Body3>
          <br />
          <TwitterShareButton
            url={window.location.href}
            title={`"${tx.parsedMessage}"  -- by ${tx.from.slice(
              0,
              6
            )}.. on Ethereum.`}
            // related={['antonttc']}
          >
            <TwitterIcon size={30} round={true} />
          </TwitterShareButton>
        </Box>
      </Popover>
    </div>
  );
}
