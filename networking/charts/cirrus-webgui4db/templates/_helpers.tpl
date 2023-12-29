{{/*
Expand the name of the webApp chart.
*/}}
{{- define "cirrus-webgui4db.name" -}}
{{- default .Chart.Name .Values.webApp.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
{{/*
Expand the name of the serviceGateway chart.
*/}}
{{- define "cirrus-service-gateway.name" -}}
{{- default .Chart.Name .Values.serviceGateway.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
{{/*
Expand the name of the serviceMongoDb chart.
*/}}
{{- define "cirrus-service-mongodb.name" -}}
{{- default .Chart.Name .Values.serviceMongoDb.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
{{/*
Expand the name of the servicePostgreSql chart.
*/}}
{{- define "cirrus-service-postgresql.name" -}}
{{- default .Chart.Name .Values.servicePostgreSql.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified webApp name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "cirrus-webgui4db.fullname" -}}
{{- if .Values.webApp.fullnameOverride }}
{{- .Values.webApp.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.webApp.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}
{{/*
Create a fully qualified serviceGateway name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "cirrus-service-gateway.fullname" -}}
{{- .Values.serviceGateway.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
{{/*
Create a fully qualified serviceMongoDb name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "cirrus-service-mongodb.fullname" -}}
{{- .Values.serviceMongoDb.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
{{/*
Create a fully qualified servicePostgreSql name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "cirrus-service-postgresql.fullname" -}}
{{- .Values.servicePostgreSql.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "cirrus-webgui4db.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}
{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "cirrus-service-gateway.chart" -}}
{{- printf "cirrus-service-gateway-%s" .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "cirrus-service-mongodb.chart" -}}
{{- printf "cirrus-service-mongodb-%s" .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "cirrus-service-postgresql.chart" -}}
{{- printf "cirrus-service-postgresql-%s" .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/*
Common labels
*/}}
{{- define "cirrus-webgui4db.labels" -}}
helm.sh/chart: {{ include "cirrus-webgui4db.chart" . }}
{{ include "cirrus-webgui4db.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
{{/*
Common labels
*/}}
{{- define "cirrus-service-gateway.labels" -}}
helm.sh/chart: {{ include "cirrus-service-gateway.chart" . }}
{{ include "cirrus-service-gateway.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
{{/*
Common labels
*/}}
{{- define "cirrus-service-mongodb.labels" -}}
helm.sh/chart: {{ include "cirrus-service-mongodb.chart" . }}
{{ include "cirrus-service-mongodb.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
{{/*
Common labels
*/}}
{{- define "cirrus-service-postgresql.labels" -}}
helm.sh/chart: {{ include "cirrus-service-postgresql.chart" . }}
{{ include "cirrus-service-postgresql.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}


{{/*
Selector labels
*/}}
{{- define "cirrus-webgui4db.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cirrus-webgui4db.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
{{/*
{{/*
Selector labels
*/}}
{{- define "cirrus-service-gateway.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cirrus-service-gateway.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
{{/*
Selector labels
*/}}
{{- define "cirrus-service-mongodb.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cirrus-service-mongodb.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
{{/*
Selector labels
*/}}
{{- define "cirrus-service-postgresql.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cirrus-service-postgresql.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use with webApp
*/}}
{{- define "cirrus-webgui4db.serviceAccountName" -}}
{{- if .Values.webApp.serviceAccount.create }}
{{- default (include "cirrus-webgui4db.fullname" .) .Values.webApp.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.webApp.serviceAccount.name }}
{{- end }}
{{- end }}
{{/*
Create the name of the service account to use with serviceGateway
*/}}
{{- define "cirrus-service-gateway.serviceAccountName" -}}
{{- if .Values.serviceGateway.serviceAccount.create }}
{{- default (include "cirrus-service-gateway.fullname" .) .Values.serviceGateway.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceGateway.serviceAccount.name }}
{{- end }}
{{- end }}
{{/*
Create the name of the service account to use with serviceMongoDb
*/}}
{{- define "cirrus-service-mongodb.serviceAccountName" -}}
{{- if .Values.serviceMongoDb.serviceAccount.create }}
{{- default (include "cirrus-service-mongodb.fullname" .) .Values.serviceMongoDb.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceMongoDb.serviceAccount.name }}
{{- end }}
{{- end }}
{{/*
Create the name of the service account to use with servicePostgreSql
*/}}
{{- define "cirrus-service-postgresql.serviceAccountName" -}}
{{- if .Values.servicePostgreSql.serviceAccount.create }}
{{- default (include "cirrus-service-postgresql.fullname" .) .Values.servicePostgreSql.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.servicePostgreSql.serviceAccount.name }}
{{- end }}
{{- end }}
