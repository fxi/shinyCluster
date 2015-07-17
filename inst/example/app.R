# server
server<-function(input,output,session){
  output$plotHist<-renderPlot(hist(rnorm(input$sliderNum)))
  session$onSessionEnded(function() {
    print('session ended')
})

}

# ui
ui<-fluidPage(
  p('port=',port),
  sliderInput('sliderNum','Choose',min=1,max=100,value=100),
  plotOutput('plotHist')
  )


shinyApp(ui = ui, server = server)
