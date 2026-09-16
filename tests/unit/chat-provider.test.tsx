import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as intelligenceActions from "@/actions/intelligence";
import {
  ChatSessionProvider,
  useChatSession,
} from "@/components/chat/ChatSessionProvider";

// Sibling consumer component to test cross-component and persistent state
function TestChatConsumer({ label }: { label: string }) {
  const { sessionId, messages, sendMessage, clearChat, isSending } = useChatSession();

  return (
    <div data-testid={`consumer-${label}`}>
      <span data-testid={`session-id-${label}`}>{sessionId}</span>
      <span data-testid={`msg-count-${label}`}>{messages.length}</span>
      <ul data-testid={`msg-list-${label}`}>
        {messages.map((m) => (
          <li key={m.id} data-testid={`msg-item-${label}`}>
            {m.role}: {m.text}
          </li>
        ))}
      </ul>
      <button
        onClick={() => sendMessage("Test question from " + label)}
        disabled={isSending}
        data-testid={`btn-send-${label}`}
      >
        Send
      </button>
      <button onClick={clearChat} data-testid={`btn-clear-${label}`}>
        Clear
      </button>
    </div>
  );
}

describe("ChatSessionProvider (Ephemeral Session State)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with valid sessionId and empty messages without touching localStorage or sessionStorage", () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <ChatSessionProvider>
        <TestChatConsumer label="A" />
      </ChatSessionProvider>
    );

    const sessionId = screen.getByTestId("session-id-A").textContent;
    expect(sessionId).toBeTruthy();
    expect(screen.getByTestId("msg-count-A").textContent).toBe("0");

    // Strictly verify no browser storage is accessed
    expect(getItemSpy).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();
  });

  it("shares persistent state between sibling components and preserves state across re-renders", async () => {
    vi.spyOn(intelligenceActions, "sendChatMessage").mockResolvedValue({
      success: true,
      data: {
        id: "msg_assist_1",
        role: "assistant",
        text: "This is the answer.",
        confidence: 0.95,
        citations: [],
        createdAt: new Date().toISOString(),
      },
    });

    render(
      <ChatSessionProvider>
        <TestChatConsumer label="View1" />
        <TestChatConsumer label="View2" />
      </ChatSessionProvider>
    );

    const sessionView1 = screen.getByTestId("session-id-View1").textContent;
    const sessionView2 = screen.getByTestId("session-id-View2").textContent;
    expect(sessionView1).toBe(sessionView2);

    // Send a message from View1
    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-send-View1"));
    });

    // Both View1 and View2 should show 2 messages (1 user, 1 assistant)
    expect(screen.getByTestId("msg-count-View1").textContent).toBe("2");
    expect(screen.getByTestId("msg-count-View2").textContent).toBe("2");

    // SessionId must remain identical
    expect(screen.getByTestId("session-id-View1").textContent).toBe(sessionView1);
    expect(screen.getByTestId("session-id-View2").textContent).toBe(sessionView1);
  });

  it("clearChat resets messages and generates a fresh sessionId", async () => {
    vi.spyOn(intelligenceActions, "sendChatMessage").mockResolvedValue({
      success: true,
      data: {
        id: "msg_assist_2",
        role: "assistant",
        text: "Response",
        confidence: 0.9,
        citations: [],
        createdAt: new Date().toISOString(),
      },
    });

    render(
      <ChatSessionProvider>
        <TestChatConsumer label="Main" />
      </ChatSessionProvider>
    );

    const initialSessionId = screen.getByTestId("session-id-Main").textContent;

    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-send-Main"));
    });

    expect(screen.getByTestId("msg-count-Main").textContent).toBe("2");

    // Click clear chat
    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-clear-Main"));
    });

    expect(screen.getByTestId("msg-count-Main").textContent).toBe("0");
    const newSessionId = screen.getByTestId("session-id-Main").textContent;
    expect(newSessionId).toBeTruthy();
    expect(newSessionId).not.toBe(initialSessionId);
  });
});
