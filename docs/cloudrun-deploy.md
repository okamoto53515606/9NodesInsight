# Cloud Run デプロイガイド（東京リージョン）

## 概要

9NodesInsight を Firebase App Hosting（USリージョン、月約2000円）から
Cloud Run（asia-northeast1 / 東京、月約30円）に移行する手順です。

- **GCPプロジェクト**: `okamo1-153103`
- **リージョン**: `asia-northeast1`（東京）
- **サービス名**: `ninenodes-insight`
- **Artifact Registry**: `ninenodes-images`
- **Service URL**: `https://ninenodes-insight-XXXXXXXXXX.asia-northeast1.run.app`

## 前提条件

- gcloud CLI がインストールされていること
- `gcloud auth login` で認証済みであること
- GCP プロジェクト `okamo1-153103` にアクセスできること

## 1. プロジェクト設定

```bash
gcloud config set project okamo1-153103
```

## 2. Artifact Registry（初回のみ）

```bash
gcloud artifacts repositories create ninenodes-images \
  --repository-format=docker \
  --location=asia-northeast1 \
  --project=okamo1-153103
```

## 3. コンテナイメージのビルド

Cloud Build を使ってビルドします。`_IMAGE_TAG` のバージョンは適宜更新してください。

```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --project=okamo1-153103 \
  --region=asia-northeast1 \
  --substitutions=_IMAGE_TAG=asia-northeast1-docker.pkg.dev/okamo1-153103/ninenodes-images/ninenodes-insight:v1
```

## 4. Cloud Run へデプロイ

```bash
gcloud run deploy ninenodes-insight \
  --image=asia-northeast1-docker.pkg.dev/okamo1-153103/ninenodes-images/ninenodes-insight:v1 \
  --region=asia-northeast1 \
  --project=okamo1-153103 \
  --platform=managed \
  --port=8080 \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --max-instances=1 \
  --min-instances=0 \
  --timeout=300 \
  --set-env-vars="GOOGLE_GENAI_API_KEY=YOUR_API_KEY"
```

> **重要**: `--min-instances=0` により、アクセスがないときはインスタンスが完全にゼロになり、
> アイドルコストが発生しません。これが Firebase App Hosting との最大の違いです。

## 5. デプロイ確認

```bash
# HTTPステータスとレスポンス時間を確認
curl -s -o /dev/null -w "HTTP Status: %{http_code}\nTTFB: %{time_starttransfer}s\n" \
  https://ninenodes-insight-XXXXXXXXXX.asia-northeast1.run.app/
```

## 6. 再ビルド＆再デプロイ（更新手順）

コード変更後の手順：

```bash
# 1. バージョン番号を更新してビルド（v1 → v2 → v3...）
gcloud builds submit \
  --config=cloudbuild.yaml \
  --project=okamo1-153103 \
  --region=asia-northeast1 \
  --substitutions=_IMAGE_TAG=asia-northeast1-docker.pkg.dev/okamo1-153103/ninenodes-images/ninenodes-insight:v2

# 2. 新しいイメージでデプロイ（環境変数は前回の設定が保持されるため --set-env-vars 不要）
gcloud run deploy ninenodes-insight \
  --image=asia-northeast1-docker.pkg.dev/okamo1-153103/ninenodes-images/ninenodes-insight:v2 \
  --region=asia-northeast1 \
  --project=okamo1-153103
```

## 構成ファイル

| ファイル | 説明 |
|---------|------|
| `Dockerfile` | マルチステージビルド（deps → builder → runner） |
| `.dockerignore` | Dockerビルドの除外ファイル |
| `cloudbuild.yaml` | Cloud Build設定 |
| `next.config.ts` | `output: 'standalone'`（既存） |

## Firebase App Hosting → Cloud Run 移行のポイント

| 項目 | 移行前（AI Studio） | 移行後（Cloud Run） |
|------|---------------------|---------------------|
| リージョン | US 固定 | asia-northeast1（東京） |
| min-instances | 1（常時待機） | 0（スケールゼロ） |
| メモリ | デフォルト | 512Mi |
| CPU | デフォルト | 1 vCPU |
| 月額概算 | 約2000円 | 約30円以下 |
