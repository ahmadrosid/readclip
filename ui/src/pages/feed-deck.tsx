import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { DeckItem } from "@/components/feed/deck-item";
import { FeedItem } from "@/components/feed/feed-item";
import { type BaseDeck } from "@/components/feed";

type FeedItemValue = {
  type: BaseDeck["type"];
  url: string;
  options: string[];
};

type SavedComponentItem = BaseDeck & { id: string };

export default function FeedDeckPage() {
  const deckItemKey = "saved-decks-items";
  const [showAddDeckDialog, setShowAddDeckDialog] = useState(false);
  const [savedDecksComponents, setSavedDecksComponents] = useState<
    SavedComponentItem[]
  >(() => {
    const savedDecks = window.localStorage.getItem(deckItemKey);
    if (savedDecks) {
      const data = JSON.parse(savedDecks);
      return data;
    }
    return [];
  });
  const [selectedFeedItem, setSelectedFeedItem] = useState<
    FeedItemValue | undefined
  >();

  const handleAddNewFeed = useCallback(() => {
    console.log(selectedFeedItem);
    if (!selectedFeedItem) {
      setShowAddDeckDialog(false);
      return;
    }
    if (selectedFeedItem.type === "rss" && selectedFeedItem.url === "") {
      setShowAddDeckDialog(false);
      return toast.error("Rss feed url is required!");
    }
    setSavedDecksComponents((prev) => {
      const newDeck = [
        ...prev,
        {
          type: selectedFeedItem.type,
          url: selectedFeedItem.url,
          options: selectedFeedItem.options,
          id: crypto.randomUUID(),
        },
      ];
      window.localStorage.setItem(deckItemKey, JSON.stringify(newDeck));
      return newDeck;
    });
    setSelectedFeedItem(undefined);
    setShowAddDeckDialog(false);
  }, [selectedFeedItem]);

  const handleDeleteSavedDeckById = (id: string) => {
    setSavedDecksComponents((prev) => {
      const data = [...prev];
      const newDeck = data.filter((item) => item.id != id);
      window.localStorage.setItem(deckItemKey, JSON.stringify(newDeck));
      return newDeck;
    });
  };

  return (
    <div className="">
      {/* <div className="w-full snap-x snap-proximity flex overflow-x-auto border-l"> */}
      <div className="flex-grow flex overflow-x-auto snap-x snap-mandatory">
        {savedDecksComponents.map((item, idx) => (
          <DeckItem
            key={idx}
            type={item.type}
            url={item.url}
            options={item.options}
            id={item.id}
            onDeleteDeck={(id) => handleDeleteSavedDeckById(id)}
          />
        ))}
        <div
          className={cn(
            "min-w-[28rem]",
            savedDecksComponents.length === 0 &&
              "w-screen grid place-content-center  h-[80vh]"
          )}
        >
          <div className="text-center">
            {savedDecksComponents.length === 0 && (
              <div className="p-4">
                <div className="flex justify-center flex-row">
                  <img
                    className="w-44 h-44 opacity-5"
                    src="https://cdn-icons-png.flaticon.com/512/4076/4076510.png"
                    alt="Empty feed"
                  />
                </div>
                <p className="max-w-xs text-base font-normal text-gray-700 tracking-tight">
                  Your feeds list is empty. Click 'Add Feed' to add a new one.
                </p>
              </div>
            )}
            <Dialog
              open={showAddDeckDialog}
              onOpenChange={setShowAddDeckDialog}
            >
              {savedDecksComponents.length === 0 ? (
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-between px-3 pr-5"
                  >
                    <PlusIcon className="w-4 h-4 mr-1" /> Add feed
                  </Button>
                </DialogTrigger>
              ) : (
                <div className="w-[28rem] border-r border-l border-b h-[91vh] bg-white">
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="rounded-none shadow-none w-full border-b h-[41px]"
                    >
                      <PlusIcon className="w-4 h-4 mr-1" />
                      Add new feed
                    </Button>
                  </DialogTrigger>
                </div>
              )}
              <DialogContent className="p-0 overflow-hidden gap-0">
                <DialogHeader className="px-4 py-4 border-b bg-gray-50">
                  <DialogTitle>Add feed</DialogTitle>
                </DialogHeader>
                <div className="px-4 py-2 flex items-center gap-2">
                  <SearchIcon className="w-5 h-5 text-gray-500" />
                  <input
                    placeholder="Search"
                    className="p-2 w-full focus:outline-none"
                  />
                </div>
                <div className="max-h-[400px] overflow-y-auto border-t">
                  <ul className="grid">
                    <FeedItem
                      type="github"
                      label="Github Trending"
                      defaultItem={selectedFeedItem}
                      onValueUpdate={setSelectedFeedItem}
                    />
                    <FeedItem
                      type="rss"
                      label="RSS Feed"
                      onValueUpdate={setSelectedFeedItem}
                    />
                    <FeedItem
                      type="reddit"
                      label="Sub Reddit"
                      onValueUpdate={setSelectedFeedItem}
                    />
                    <FeedItem
                      type="hackernews"
                      label="Hackernews"
                      onValueUpdate={setSelectedFeedItem}
                    />
                    <FeedItem
                      type="youtube"
                      label="Youtube Channel"
                      onValueUpdate={setSelectedFeedItem}
                    />
                  </ul>
                </div>
                <DialogFooter className="px-4 py-3 bg-gray-50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddDeckDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" className="px-6" onClick={handleAddNewFeed}>
                    Add
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
