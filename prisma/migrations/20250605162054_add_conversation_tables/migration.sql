-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "last_message_at" TIMESTAMP(3) NOT NULL,
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "selected_template" TEXT,
    "selected_model" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "message_index" INTEGER NOT NULL,
    "model" TEXT,
    "template" TEXT,
    "tokens_used" INTEGER,
    "cost_usd" DECIMAL(10,6),
    "processing_time_ms" INTEGER,
    "has_latex_code" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "conversations_user_id_idx" ON "conversations"("user_id");

-- CreateIndex
CREATE INDEX "conversations_last_message_at_idx" ON "conversations"("last_message_at");

-- CreateIndex
CREATE INDEX "conversations_created_at_idx" ON "conversations"("created_at");

-- CreateIndex
CREATE INDEX "conversation_messages_conversation_id_idx" ON "conversation_messages"("conversation_id");

-- CreateIndex
CREATE INDEX "conversation_messages_role_idx" ON "conversation_messages"("role");

-- CreateIndex
CREATE INDEX "conversation_messages_created_at_idx" ON "conversation_messages"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_messages_conversation_id_message_index_key" ON "conversation_messages"("conversation_id", "message_index");

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_messages" ADD CONSTRAINT "conversation_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
