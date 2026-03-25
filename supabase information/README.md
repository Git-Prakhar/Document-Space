# Table - model_list :
## Add Columns:
- model_id: text
- label: text
- badge: text

## Insert Rows:
- gemini-2.5-flash | Gemini 2.5 Flash | API
- gemini-2.5-pro | Gemini 2.5 Pro | API
- qwen3-8B | Qwen3 8B | Local
- qwen3-4B | Qwen3 4B | Local

# Table - chat_table:
## Add Columns:
- chat_id: text
- title: text (default value: "New Chat")
- last_active: timestampz 
- source_count: int4 (default value: 0)
- sources: jsonb (default value: {"sources": []})
- messages: jsonb (default value: {"messages": []})
- title_draft: text (default value: "New Chat")