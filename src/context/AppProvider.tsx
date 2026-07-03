"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AUTH_KEY,
  genId,
  readDB,
  resetDB,
  writeDB,
} from "@/lib/storage";
import { seedDatabase } from "@/lib/seed";
import type {
  AppDatabase,
  DraftComment,
  DraftDocument,
  DraftStatus,
  Feedback,
  FeedbackResponse,
  LegalAidRequest,
  LegalDocument,
  NewsArticle,
  OpenLetterContent,
  User,
  UserRole,
  VisionContent,
} from "@/lib/types";

interface AppContextValue {
  db: AppDatabase;
  ready: boolean;
  currentUser: User | null;

  // Auth
  login: (email: string, password: string) => { ok: boolean; message: string };
  register: (data: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    organization?: string;
  }) => { ok: boolean; message: string };
  logout: () => void;

  // Documents
  addDocument: (doc: Omit<LegalDocument, "id" | "createdAt" | "views">) => void;
  incrementDocViews: (id: string) => void;

  // Feedback
  addFeedback: (
    data: Pick<Feedback, "title" | "field" | "content" | "isPublic">
  ) => void;
  respondFeedback: (feedbackId: string, content: string, agency: string) => void;
  updateFeedbackStatus: (feedbackId: string, status: Feedback["status"]) => void;
  toggleUpvote: (feedbackId: string) => void;

  // Drafts
  addDraftComment: (draftId: string, content: string) => void;
  addDraft: (
    data: Pick<
      DraftDocument,
      "title" | "agency" | "category" | "summary" | "openDate" | "closeDate"
    >
  ) => void;
  updateDraftStatus: (draftId: string, status: DraftStatus) => void;

  // News
  addNews: (data: Omit<NewsArticle, "id" | "publishedAt" | "views">) => void;

  // Legal aid
  addLegalAid: (
    data: Pick<LegalAidRequest, "fullName" | "contact" | "field" | "question">
  ) => void;
  answerLegalAid: (id: string, answer: string) => void;

  // Nội dung tĩnh (CMS)
  updateVision: (vision: VisionContent) => void;
  updateOpenLetter: (letter: OpenLetterContent) => void;

  resetData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<AppDatabase>(() => ({
    users: [],
    documents: [],
    drafts: [],
    feedbacks: [],
    news: [],
    legalAid: [],
    // Nội dung tĩnh cần có sẵn ở lần render đầu (trước khi đọc localStorage)
    siteContent: seedDatabase.siteContent,
  }));
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // Nạp dữ liệu từ localStorage sau khi component mount (client-side)
  useEffect(() => {
    setDb(readDB());
    try {
      const rawUser = window.localStorage.getItem(AUTH_KEY);
      if (rawUser) setCurrentUser(JSON.parse(rawUser) as User);
    } catch {
      /* bỏ qua */
    }
    setReady(true);

    const sync = () => setDb(readDB());
    window.addEventListener("cpl-db-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cpl-db-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  /** Ghi CSDL mới và cập nhật state cục bộ */
  const persist = useCallback((next: AppDatabase) => {
    writeDB(next);
    setDb(next);
  }, []);

  const login = useCallback(
    (email: string, password: string) => {
      const user = db.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (!user) return { ok: false, message: "Email chưa được đăng ký." };
      if (user.password !== password)
        return { ok: false, message: "Mật khẩu không đúng." };
      setCurrentUser(user);
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return { ok: true, message: "Đăng nhập thành công." };
    },
    [db.users]
  );

  const register = useCallback<AppContextValue["register"]>(
    (data) => {
      const exists = db.users.some(
        (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
      );
      if (exists) return { ok: false, message: "Email đã tồn tại." };
      const user: User = {
        id: genId("u"),
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        password: data.password,
        role: data.role,
        organization: data.organization?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      const next = { ...db, users: [...db.users, user] };
      persist(next);
      setCurrentUser(user);
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return { ok: true, message: "Đăng ký thành công." };
    },
    [db, persist]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    window.localStorage.removeItem(AUTH_KEY);
  }, []);

  const addDocument = useCallback<AppContextValue["addDocument"]>(
    (doc) => {
      const newDoc: LegalDocument = {
        ...doc,
        id: genId("d"),
        createdAt: new Date().toISOString(),
        views: 0,
      };
      persist({ ...db, documents: [newDoc, ...db.documents] });
    },
    [db, persist]
  );

  const incrementDocViews = useCallback(
    (id: string) => {
      const next = {
        ...db,
        documents: db.documents.map((d) =>
          d.id === id ? { ...d, views: d.views + 1 } : d
        ),
      };
      persist(next);
    },
    [db, persist]
  );

  const addFeedback = useCallback<AppContextValue["addFeedback"]>(
    (data) => {
      if (!currentUser) return;
      const fb: Feedback = {
        id: genId("f"),
        title: data.title,
        field: data.field,
        content: data.content,
        isPublic: data.isPublic,
        authorId: currentUser.id,
        authorName: currentUser.organization || currentUser.fullName,
        authorRole: currentUser.role,
        status: "moi",
        createdAt: new Date().toISOString(),
        responses: [],
        upvotes: [],
      };
      persist({ ...db, feedbacks: [fb, ...db.feedbacks] });
    },
    [currentUser, db, persist]
  );

  const respondFeedback = useCallback(
    (feedbackId: string, content: string, agency: string) => {
      if (!currentUser) return;
      const response: FeedbackResponse = {
        id: genId("fr"),
        responderId: currentUser.id,
        responderName: currentUser.fullName,
        agency,
        content,
        createdAt: new Date().toISOString(),
      };
      persist({
        ...db,
        feedbacks: db.feedbacks.map((f) =>
          f.id === feedbackId
            ? {
                ...f,
                responses: [...f.responses, response],
                status: "da-phan-hoi",
              }
            : f
        ),
      });
    },
    [currentUser, db, persist]
  );

  const updateFeedbackStatus = useCallback(
    (feedbackId: string, status: Feedback["status"]) => {
      persist({
        ...db,
        feedbacks: db.feedbacks.map((f) =>
          f.id === feedbackId ? { ...f, status } : f
        ),
      });
    },
    [db, persist]
  );

  const toggleUpvote = useCallback(
    (feedbackId: string) => {
      if (!currentUser) return;
      persist({
        ...db,
        feedbacks: db.feedbacks.map((f) => {
          if (f.id !== feedbackId) return f;
          const has = f.upvotes.includes(currentUser.id);
          return {
            ...f,
            upvotes: has
              ? f.upvotes.filter((id) => id !== currentUser.id)
              : [...f.upvotes, currentUser.id],
          };
        }),
      });
    },
    [currentUser, db, persist]
  );

  const addDraftComment = useCallback(
    (draftId: string, content: string) => {
      if (!currentUser) return;
      const comment: DraftComment = {
        id: genId("c"),
        authorId: currentUser.id,
        authorName: currentUser.organization || currentUser.fullName,
        authorRole: currentUser.role,
        content,
        createdAt: new Date().toISOString(),
      };
      persist({
        ...db,
        drafts: db.drafts.map((d) =>
          d.id === draftId ? { ...d, comments: [...d.comments, comment] } : d
        ),
      });
    },
    [currentUser, db, persist]
  );

  const addDraft = useCallback<AppContextValue["addDraft"]>(
    (data) => {
      if (!currentUser) return;
      const draft: DraftDocument = {
        ...data,
        id: genId("dr"),
        status: "dang-lay-y-kien",
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        comments: [],
      };
      persist({ ...db, drafts: [draft, ...db.drafts] });
    },
    [currentUser, db, persist]
  );

  const updateDraftStatus = useCallback(
    (draftId: string, status: DraftStatus) => {
      persist({
        ...db,
        drafts: db.drafts.map((d) =>
          d.id === draftId ? { ...d, status } : d
        ),
      });
    },
    [db, persist]
  );

  const addNews = useCallback<AppContextValue["addNews"]>(
    (data) => {
      const article: NewsArticle = {
        ...data,
        id: genId("n"),
        publishedAt: new Date().toISOString(),
        views: 0,
      };
      persist({ ...db, news: [article, ...db.news] });
    },
    [db, persist]
  );

  const addLegalAid = useCallback<AppContextValue["addLegalAid"]>(
    (data) => {
      const req: LegalAidRequest = {
        ...data,
        id: genId("la"),
        authorId: currentUser?.id,
        status: "cho-tiep-nhan",
        createdAt: new Date().toISOString(),
      };
      persist({ ...db, legalAid: [req, ...db.legalAid] });
    },
    [currentUser, db, persist]
  );

  const answerLegalAid = useCallback(
    (id: string, answer: string) => {
      persist({
        ...db,
        legalAid: db.legalAid.map((r) =>
          r.id === id ? { ...r, answer, status: "da-tra-loi" } : r
        ),
      });
    },
    [db, persist]
  );

  const updateVision = useCallback<AppContextValue["updateVision"]>(
    (vision) => {
      persist({ ...db, siteContent: { ...db.siteContent, vision } });
    },
    [db, persist]
  );

  const updateOpenLetter = useCallback<AppContextValue["updateOpenLetter"]>(
    (openLetter) => {
      persist({ ...db, siteContent: { ...db.siteContent, openLetter } });
    },
    [db, persist]
  );

  const resetData = useCallback(() => {
    const fresh = resetDB();
    setDb(fresh);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      db,
      ready,
      currentUser,
      login,
      register,
      logout,
      addDocument,
      incrementDocViews,
      addFeedback,
      respondFeedback,
      updateFeedbackStatus,
      toggleUpvote,
      addDraftComment,
      addDraft,
      updateDraftStatus,
      addNews,
      addLegalAid,
      answerLegalAid,
      updateVision,
      updateOpenLetter,
      resetData,
    }),
    [
      db,
      ready,
      currentUser,
      login,
      register,
      logout,
      addDocument,
      incrementDocViews,
      addFeedback,
      respondFeedback,
      updateFeedbackStatus,
      toggleUpvote,
      addDraftComment,
      addDraft,
      updateDraftStatus,
      addNews,
      addLegalAid,
      answerLegalAid,
      updateVision,
      updateOpenLetter,
      resetData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp phải được dùng bên trong <AppProvider>");
  return ctx;
}
